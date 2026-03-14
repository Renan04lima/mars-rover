import { useRoverSimulation } from '../hooks/useRoverSimulation';
import {RoverPiece} from './Rover/RoverPiece';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Settings2 } from 'lucide-react';

export const RoverSimulation = () => {
  const {
    grid,
    position,
    orientation,
    isPlaying,
    collectedData,
    commandsStr,
    setCommandsStr,
    runSimulation,
    reset,
    currentCommandIndex,
    apiResult,
    isCollecting
  } = useRoverSimulation();

  const commandsList = commandsStr.split(',').map(c => c.trim().toUpperCase());

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-2xl mb-2">
            <Settings2 className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-50 tracking-tight">Mars Rover Simulator</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Input sequential commands and watch the rover navigate the Martian terrain while avoiding obstacles and collecting data.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-3">Mission Control</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Command Sequence</label>
                <input
                  type="text"
                  disabled={isPlaying}
                  value={commandsStr}
                  onChange={(e) => setCommandsStr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="F, F, R, F, F, L, F, S"
                />
                <p className="text-xs text-slate-500 mt-2">
                  F=Forward, B=Backward, L=Left, R=Right, S=Scan
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={runSimulation}
                  disabled={isPlaying}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {isPlaying ? 'Simulating...' : 'Launch Mission'}
                </button>
                <button
                  onClick={reset}
                  disabled={isPlaying && currentCommandIndex !== -1}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Live Telemetry */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Live Telemetry</h3>
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Position</span>
                  <span className="font-mono text-slate-200 text-lg">[{position[0]}, {position[1]}]</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Orientation</span>
                  <span className="font-mono text-slate-200 text-lg">{orientation}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {commandsList.map((cmd, idx) => (
                  <span 
                    key={idx}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded font-mono text-sm font-bold transition-all
                      ${idx === currentCommandIndex 
                        ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50' 
                        : idx < currentCommandIndex 
                          ? 'bg-slate-700 text-slate-500' 
                          : 'bg-slate-800 border border-slate-700 text-slate-400'}
                    `}
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend Verification */}
            <AnimatePresence>
              {apiResult && !isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-xl space-y-2 text-sm"
                >
                  <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Final Backend State
                  </h3>
                  <div className="text-emerald-200/80 font-mono">
                    <div>End: [{apiResult.final_position[0]}, {apiResult.final_position[1]}] • {apiResult.final_orientation}</div>
                    <div>Scans: {apiResult.data_collected.length} points</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Grid Map (The game board) */}
          <div className="lg:col-span-2 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
             
            <div 
              className="relative bg-slate-900/50 p-2 rounded-xl"
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                gap: '8px', 
              }}
            >
              {grid.map((row, y) => (
                row.map((cell, x) => {
                  const isScanned = collectedData.some(p => p[0] === x && p[1] === y);

                  return (
                    <div 
                      key={`${x}-${y}`}
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-xl border relative
                        transition-colors duration-500 ease-in-out
                        ${cell === 1 
                          ? 'bg-slate-800 border-slate-700' // Obstacle
                          : 'bg-slate-950 border-slate-800' // Free space
                        }
                        ${isScanned ? 'bg-amber-900/20 border-amber-800/50' : ''}
                      `}
                    >
                      {/* Inner obstacle styling */}
                      {cell === 1 && (
                        <div className="absolute inset-2 bg-slate-700 rounded-lg opacity-50" />
                      )}
                      
                      {/* Scanned Marker */}
                      {isScanned && cell !== 1 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        </motion.div>
                      )}

                    </div>
                  );
                })
              ))}

              {/* Floating Rover using Absolute positioning & animating left/top coords */}
              <motion.div
                className="absolute p-2"
                style={{
                   width: 'max(4rem, 100% / 4)', // Need to map to pixel grid dynamically 
                   // Based on w-16 or w-20 roughly. A better way: Left/Top mapping. 
                   // Current grid uses 8px gap + padding 8px
                }}
                animate={{
                   x: position[0] * (80 + 8) + 8, // Assuming sm:w-20 (80px) + 8px gap + 8px grid pad
                   y: position[1] * (80 + 8) + 8  // Simplified generic mapping
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
              >
                  <div className="w-16 h-16 sm:w-20 sm:h-20"> 
                    <RoverPiece orientation={orientation} isCollecting={isCollecting && currentCommandIndex !== -1} />
                  </div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
