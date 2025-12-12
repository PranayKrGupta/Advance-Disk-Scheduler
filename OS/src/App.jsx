import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={`min-h-screen p-6 pb-32 relative transition-colors duration-500 ${styles.bg}`}>
      
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-xl backdrop-blur-md border transition-colors duration-300 ${styles.card}`}
      >
        {theme === 'dark' ? <Sun size={24} className="text-amber-400" /> : <Moon size={24} className="text-blue-600" />}
      </motion.button>

      {/* TOAST NOTIFICATION FOR DYNAMIC REQUESTS */}
      <AnimatePresence>
        {lastAddedRequest !== null && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white pl-4 pr-6 py-4 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4 border border-amber-400/50 min-w-[280px]"
          >
            <div className="bg-white/20 p-2 rounded-lg shadow-inner">
              <HardDrive size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider">New I/O Request</span>
                <span className="text-xl font-bold font-mono">Track #{lastAddedRequest}</span>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        )}
        </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            Disk Scheduling Simulator
          </h1>
          <p className={`text-lg font-light ${styles.textMuted}`}>Visualize and compare OS disk scheduling algorithms in real-time</p>
        </motion.div>
        
        <Controls
          head={head}
          setHead={setHead}
          queue={queue}
          setQueue={setQueue}
          direction={direction}
          setDirection={setDirection}
          onRandomize={handleRandomize}
          graphMode={graphMode}
          setGraphMode={setGraphMode}
          maxTrack={maxTrack}
          setMaxTrack={setMaxTrack}
          queueLength={queueLength}
          setQueueLength={setQueueLength}
          onManualQueueChange={handleManualQueueChange}
          theme={theme}
        />
        
        <div className="flex justify-center gap-4 my-8">
          <button
            onClick={() => setViewMode('arena')}
            className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-xl border-2 ${
              viewMode === 'arena'
                ? styles.button.active + ' shadow-2xl'
                : styles.button.secondary
            }`}
          >
            🏟️ Arena Mode
          </button>
          
          <button
            onClick={() => setViewMode('focus')}
            className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-xl border-2 ${
              viewMode === 'focus'
                ? styles.button.active + ' shadow-2xl'
                : styles.button.secondary
            }`}
          >
            🎯 Focus Mode
          </button>
        </div>
        
        {viewMode === 'arena' && (
          <div className="flex flex-col gap-8" ref={simulationRef}>
            {Object.keys(algorithms).map(key => (
              <div key={key} className={`${styles.card} rounded-2xl p-6 border shadow-xl ${key === winner && isFinished ? 'border-emerald-400/50 shadow-emerald-500/10' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${styles.text} flex items-center gap-3`}>
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: algorithms[key].color, boxShadow: `0 0 15px ${algorithms[key].color}60` }}></div>
                    {algorithms[key].name}
                  </h3>
                  {key === winner && isFinished && (
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">WINNER</span>
                  )}
                </div>
                
                <div className={`${styles.innerCard} rounded-xl p-4 border mb-6`}>
                  <h4 className={`text-sm ${styles.textMuted} font-medium mb-2 uppercase tracking-wide`}>Seek Path</h4>
                  <SeekChart 
                    data={results[key].sequence} 
                    color={algorithms[key].color} 
                    algorithm={key}
                    graphMode={graphMode}
                    currentStep={currentStep}
                    theme={theme}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${styles.innerCard} rounded-xl p-4 border`}>
                    <h4 className={`text-sm ${styles.textMuted} font-medium mb-2 uppercase tracking-wide`}>Physical Disk</h4>
                    <DiskVisualizer
                      algorithm={key}
                      currentStep={currentStep}
                      sequence={results[key].sequence}
                      color={algorithms[key].color}
                      maxTrack={maxTrack}
                      theme={theme}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <MetricsDisplay 
                      result={results[key]} 
                      queue={queue} 
                      currentStep={currentStep} 
                      theme={theme}
                    />
                    
                    {results[key].steps[Math.max(0, currentStep - 1)] && (
                      <div className={`mt-auto p-3 ${styles.innerCard} rounded-xl border`}>
                        <div className={`text-xs ${styles.textMuted} uppercase tracking-wide mb-1`}>Log:</div>
                        <div className={`text-sm ${styles.text} font-medium`}>
                          {currentStep > 0 && currentStep <= results[key].steps.length
                            ? results[key].steps[currentStep - 1].explanation
                            : "Ready to start..."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'focus' && (
          <div className="space-y-6" ref={simulationRef}>
            <div className="flex justify-center gap-4">
              {Object.keys(algorithms).map(key => (
                <button
                  key={key}
                  onClick={() => setFocusAlgo(key)}
                  className={`px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-xl border-2 ${
                    focusAlgo === key
                      ? styles.button.active + ' shadow-2xl'
                      : styles.button.secondary
                  }`}
                  style={focusAlgo === key ? {
                    borderColor: algorithms[key].color,
                    boxShadow: `0 10px 40px ${algorithms[key].color}30`
                  } : {}}
                >
                  {algorithms[key].name}
                </button>
              ))}
            </div>
            
            <div className={`${styles.card} rounded-2xl p-6 border shadow-xl mb-6`}>
              <h3 className={`text-2xl font-bold ${styles.text} mb-4 uppercase tracking-wide`}>Seek Path Visualization</h3>
              <SeekChart 
                data={results[focusAlgo].sequence} 
                color={algorithms[focusAlgo].color} 
                algorithm={focusAlgo}
                graphMode={graphMode}
                currentStep={currentStep}
                theme={theme}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${styles.card} rounded-2xl p-6 border shadow-xl`}>
                <h3 className={`text-2xl font-bold ${styles.text} mb-4 uppercase tracking-wide`}>Physical Disk Animation</h3>
                <DiskVisualizer
                  algorithm={focusAlgo}
                  currentStep={currentStep}
                  sequence={results[focusAlgo].sequence}
                  color={algorithms[focusAlgo].color}
                  maxTrack={maxTrack}
                  theme={theme}
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className={`${styles.card} rounded-2xl p-6 border-2 ${
                  focusAlgo === winner && isFinished ? 'border-emerald-400/50 shadow-xl shadow-emerald-500/20' : theme === 'dark' ? 'border-white/10' : 'border-white/40'
                }`}>
                    <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: algorithms[focusAlgo].color }}></div>
                    <h3 className={`text-xl font-bold ${styles.text}`}>Calculation Metrics</h3>
                    {focusAlgo === winner && isFinished && (
                      <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">WINNER</span>
                    )}
                  </div>
                  <MetricsDisplay 
                    result={results[focusAlgo]} 
                    queue={queue} 
                    currentStep={currentStep} 
                    theme={theme}
                  />
                </div>
                
                {results[focusAlgo].steps[Math.max(0, currentStep - 1)] && (
                  <div className={`${styles.card} rounded-2xl p-6 border shadow-xl`}>
                    <h3 className={`text-xl font-bold ${styles.text} mb-3 uppercase tracking-wide`}>Step-by-Step Explanation</h3>
                    <div className={`p-5 ${styles.innerCard} rounded-xl border`}>
                      <div className={`text-sm ${styles.textMuted} mb-2 uppercase tracking-wide`}>Step {currentStep} of {maxSteps - 1}:</div>
                      <div className={`text-lg ${styles.text} font-medium`}>
                        {currentStep > 0 && currentStep <= results[focusAlgo].steps.length
                          ? results[focusAlgo].steps[currentStep - 1].explanation
                          : "Starting..."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <PlaybackControlBar 
        playbackState={playbackState}
        onPlayPause={handlePlayPause}
        onStep={handleStep}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        currentStep={currentStep}
        isDynamicMode={isDynamicMode}
        onToggleDynamic={() => setIsDynamicMode(!isDynamicMode)}
        isFinished={isFinished}
        requestSpeed={requestSpeed}
        setRequestSpeed={setRequestSpeed}
        theme={theme}
      />
    </div>
  );
    
}

export default App
