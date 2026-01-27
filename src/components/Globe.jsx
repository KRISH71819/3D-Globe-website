import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom shader material for lighter ocean colors
const EarthMaterial = shaderMaterial(
  { uTexture: null },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - brightens blue ocean areas to light cyan
  `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Detect ocean areas (blue dominant, low red/green)
      float isOcean = step(texColor.r + 0.05, texColor.b) * step(texColor.g, texColor.b + 0.1);
      
      // Create medium cyan ocean color (slightly darker to match reference)
      vec3 oceanCyan = vec3(0.18, 0.52, 0.62); // Slightly darker cyan-blue #2e8590
      
      // Blend: brighten oceans moderately, keep land natural
      vec3 brightenedOcean = mix(texColor.rgb * 1.15, oceanCyan, 0.45);
      vec3 brightenedLand = texColor.rgb * 1.4; // Slightly brighter land
      
      vec3 finalColor = mix(brightenedLand, brightenedOcean, isOcean);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ EarthMaterial })

const Earth = () => {
    const earthRef = useRef()
    const materialRef = useRef()
    
    // Load textures
    const [colorMap] = useTexture([
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    ])
  
    useFrame(({ clock }) => {
      if (earthRef.current) {
        earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
      }
    })
  
    return (
      <group>
        {/* Earth Sphere with custom shader for lighter oceans */}
        <mesh ref={earthRef} scale={[2.5, 2.5, 2.5]}>
          <sphereGeometry args={[1, 128, 128]} /> 
          <earthMaterial ref={materialRef} uTexture={colorMap} />
        </mesh>
        
        {/* Outer Halo - Cyan glow matching lighter ocean */}
        <mesh scale={[2.7, 2.7, 2.7]}>
            <sphereGeometry args={[1, 128, 128]} />
            <meshBasicMaterial
                color="#40c8dc"
                transparent
                opacity={0.12} 
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
      </group>
    )
  }
  
  const Lights = () => {
      return (
          <>
              {/* Natural Ambient Light */}
              <ambientLight intensity={3.5} /> 
              
              {/* Sun Light - Warmer and Directional */}
              <directionalLight position={[15, 5, 5]} intensity={12} color="#fffbeb" />
              
              {/* Soft Fill Light */}
              <directionalLight position={[-10, 5, -5]} intensity={2} color="#b3d9ff" />

              {/* Distant Blue Rim Light */}
              <pointLight position={[-20, 0, -20]} intensity={8} color="#05dcf9ff" distance={100} />
          </>
      )
  }
  
  export default function GlobeScene() {
      return (
        <div className="w-full h-full relative block bg-black">
          <Canvas camera={{ position: [0, 0, 7], fov: 40 }} gl={{ antialias: true }} style={{ width: '100%', height: '100%' }}>
              <color attach="background" args={['#000005']} />
              <Suspense fallback={null}>
                  <Lights />
                  {/* Multiple star layers for rich starfield */}
                  <Stars radius={100} depth={50} count={8000} factor={3} saturation={0} fade speed={0.5} />
                  <Stars radius={200} depth={80} count={6000} factor={5} saturation={0.1} fade speed={0.3} />
                  <Stars radius={300} depth={100} count={4000} factor={7} saturation={0} fade speed={0.2} />
                  <Earth />
                  <OrbitControls 
                      enablePan={false} 
                      enableZoom={true} 
                      minDistance={4} 
                      maxDistance={12}
                      autoRotate
                      autoRotateSpeed={0.5}
                      enableDamping
                      dampingFactor={0.05}
                  />
              </Suspense>
          </Canvas>
        </div>
      )
  }
