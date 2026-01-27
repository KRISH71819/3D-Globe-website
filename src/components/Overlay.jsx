import React from 'react';
import { Globe } from 'lucide-react';

const Overlay = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col p-6 text-blue-100 font-mono">
      {/* Top Bar - Only the heading */}
      <div className="flex items-center gap-4">
        <Globe className="w-8 h-8 text-cyan-400 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          GLOBAL RISK MONITOR
        </h1>
      </div>
    </div>
  );
};

export default Overlay;
