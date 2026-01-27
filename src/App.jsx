import GlobeScene from './components/Globe'
import Overlay from './components/Overlay'

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      <Overlay />
      <GlobeScene />
    </div>
  )
}

export default App
