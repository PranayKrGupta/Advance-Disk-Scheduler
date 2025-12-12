import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from '../ui/Tooltip';
import { themes } from '../../utils/theme';

const PlaybackControlBar = ({ 
  playbackState, onPlayPause, onStep, onStepBack, onReset, 
  speed, setSpeed, currentStep, isDynamicMode, onToggleDynamic, isFinished,
  requestSpeed, setRequestSpeed, theme
}) => {
  const styles = themes[theme];
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-slate-900/95 border-white/10' : 'bg-white/90 border-slate-200'} backdrop-blur-xl border-t p-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-colors duration-300`}
    >
      <div className="w-full flex items-center justify-between gap-4 px-4 sm:px-6">
        
        {/* Left Side: Playback Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Tooltip text="Step Back" theme={theme}>
            <button
              onClick={onStepBack}
              disabled={playbackState === 'playing' || currentStep === 0}
              className={`p-2.5 rounded-lg border transition-all ${styles.button.secondary} disabled:opacity-50`}
            >
              <SkipBack size={20} />
            </button>
          </Tooltip>

          <Tooltip text={playbackState === 'playing' ? 'Pause' : (currentStep === 0 || isFinished ? 'Start Simulation' : 'Play')} theme={theme}>
            <button
              onClick={onPlayPause}
              className={`p-2.5 rounded-lg font-bold transition-all ${
                playbackState === 'playing' 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30' 
                  : styles.button.primary
              }`}
            >
              {playbackState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </Tooltip>

          <Tooltip text="Step Forward" theme={theme}>
            <button
              onClick={onStep}
              disabled={playbackState === 'playing'}
              className={`p-2.5 rounded-lg border transition-all ${styles.button.secondary} disabled:opacity-50`}
            >
              <SkipForward size={20} />
            </button>
          </Tooltip>
          
          <Tooltip text="Reset Simulation" theme={theme}>
            <button
              onClick={onReset}
              className={`p-2.5 rounded-lg border transition-all ${styles.button.secondary}`}
            >
              <RotateCcw size={20} />
            </button>
          </Tooltip>
        </div>

        {/* Right Side: Dynamic Toggle + Two Speed Sliders with Labels */}
        <div className="flex items-center gap-4 flex-shrink-0">
            {/* Dynamic Mode Toggle */}
            <Tooltip text={isDynamicMode ? "Disable Dynamic Requests" : "Enable Dynamic Requests"} theme={theme}>
              <button
                  onClick={onToggleDynamic}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-medium ${
                    isDynamicMode 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' 
                      : styles.button.secondary
                  }`}
              >
                  <Activity size={16} className={isDynamicMode ? 'animate-pulse' : ''} />
                  <span className="hidden sm:inline">Dynamic Mode</span>
              </button>
            </Tooltip>

            {/* Request Arrival Rate */}
            <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-opacity ${styles.innerCard} ${!isDynamicMode ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex flex-col">
                   <span className={`text-[9px] uppercase ${styles.textMuted} font-bold tracking-wider leading-tight`}>Req. Rate</span>
                   <div className="flex items-center gap-2">
                       <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.5"
                          value={requestSpeed}
                          onChange={(e) => setRequestSpeed(parseFloat(e.target.value))}
                          className="w-32 h-1.5 bg-slate-400/30 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-colors"
                      />
                      <span className={`text-[10px] font-mono ${styles.textMuted} w-5 text-right`}>{requestSpeed}x</span>
                   </div>
                </div>
            </div>

            {/* Execution Speed */}
            <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${styles.innerCard}`}>
                <div className="flex flex-col">
                   <span className={`text-[9px] uppercase ${styles.textMuted} font-bold tracking-wider leading-tight`}>Exec. Speed</span>
                   <div className="flex items-center gap-2">
                       <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          value={speed}
                          onChange={(e) => setSpeed(parseFloat(e.target.value))}
                          className="w-32 h-1.5 bg-slate-400/30 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
                      />
                      <span className={`text-[10px] font-mono ${styles.textMuted} w-5 text-right`}>{speed}x</span>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaybackControlBar;