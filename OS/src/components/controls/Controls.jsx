import React, { useState, useEffect } from 'react';
import { Shuffle, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes } from '../../utils/theme';

const Controls = ({ 
  head, setHead, queue, setQueue, direction, setDirection, 
  onRandomize, graphMode, setGraphMode, maxTrack, setMaxTrack, 
  queueLength, setQueueLength, onManualQueueChange, theme
}) => {
  const [customQueueLength, setCustomQueueLength] = useState('');
  const [showCustomQueue, setShowCustomQueue] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(true);
  const [maxTrackInput, setMaxTrackInput] = useState(maxTrack.toString());
  
  // Local state for the text input
  const [localQueueInput, setLocalQueueInput] = useState(queue.join(', '));
  
  const styles = themes[theme];

  // FIX: Sync local input with parent ONLY if the data has actually changed externally
  // This prevents the text box from resetting while you are typing
  useEffect(() => {
    // 1. Parse current local input
    const currentParsed = localQueueInput.split(',')
      .map(v => {
        const parsed = parseInt(v.trim());
        return isNaN(parsed) ? null : parsed;
      })
      .filter(v => v !== null);

    // 2. Check if it matches the parent queue
    const isSynced = JSON.stringify(currentParsed) === JSON.stringify(queue);

    // 3. Only overwrite local text if they are DIFFERENT (meaning an external change occurred)
    if (!isSynced) {
      setLocalQueueInput(queue.join(', '));
    }
  }, [queue]); // Only run when parent queue updates

  // FIX: Handle local typing immediately, but safely trigger parent update
  const handleLocalQueueChange = (e) => {
    const newVal = e.target.value;
    setLocalQueueInput(newVal); // Always update the UI immediately

    // Only send to parent if there is at least one valid number
    const hasValidData = newVal.split(',')
      .some(v => !isNaN(parseInt(v.trim())));

    if (hasValidData) {
        onManualQueueChange(e);
    }
  };

  const handleQuickRandomize = (length) => {
    setQueueLength(length);
    onRandomize(length);
  };

  const handleCustomRandomize = () => {
    const length = parseInt(customQueueLength);
    if (length > 0 && length <= 1000) {
      setQueueLength(length);
      onRandomize(length);
    }
  };

  const handleMaxTrackBlur = () => {
    const val = parseInt(maxTrackInput);
    if (!isNaN(val) && val > 0 && val <= 9999) {
      setMaxTrack(val);
    } else {
      setMaxTrackInput(maxTrack.toString());
    }
  };

  return (
    <div className={`${styles.card} rounded-3xl p-8 border shadow-2xl transition-colors duration-300`}>
      <h2 className={`text-3xl font-bold ${styles.text} mb-8 flex items-center gap-3`}>
        <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 rounded-full"></div>
        Control Center
      </h2>
      
      {/* Configuration Section */}
      <div className="mb-8">
        <h3 className={`text-sm font-semibold ${styles.textMuted} uppercase tracking-wider mb-4 flex items-center gap-2`}>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`${styles.innerCard} rounded-xl p-4 border transition-colors duration-300`}>
            <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>Maximum Track Number</label>
            <input
              type="text"
              value={maxTrackInput}
              onChange={(e) => setMaxTrackInput(e.target.value)}
              onBlur={handleMaxTrackBlur}
              className={`w-full ${styles.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
              placeholder="e.g., 199, 499, 999"
            />
            <p className={`text-xs ${styles.textMuted} mt-2`}>Track range: 0-{maxTrack}</p>
          </div>
          
          <div className={`${styles.innerCard} rounded-xl p-4 border transition-colors duration-300`}>
            <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>Current Head Position</label>
            <input
              type="number"
              value={head}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setHead(Math.max(0, Math.min(maxTrack, val)));
              }}
              className={`w-full ${styles.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all`}
              placeholder={`0-${maxTrack}`}
            />
          </div>
        </div>
      </div>
      
      {/* Queue Management Section */}
      <div className="mb-8">
        <h3 className={`text-sm font-semibold ${styles.textMuted} uppercase tracking-wider mb-4 flex items-center gap-2`}>
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          Queue Management
        </h3>
        
        <div className={`${styles.innerCard} rounded-xl p-4 border mb-4 transition-colors duration-300`}>
          <label className={`block text-sm font-medium ${styles.textMuted} mb-3`}>Quick Generate</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
                { label: 'Short (5)', val: 5 },
                { label: 'Medium (10)', val: 10 },
                { label: 'Long (20)', val: 20 },
                { label: 'Very Long (50)', val: 50 }
            ].map(btn => (
                <button
                    key={btn.val}
                    onClick={() => handleQuickRandomize(btn.val)}
                    className="px-4 py-2.5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-400/20 text-blue-400 rounded-lg font-medium transition-all text-sm backdrop-blur-sm"
                >
                    {btn.label}
                </button>
            ))}
            <button
              onClick={() => setShowCustomQueue(!showCustomQueue)}
              className={`px-4 py-2.5 ${styles.button.secondary} rounded-lg font-medium transition-all text-sm backdrop-blur-sm flex items-center justify-center gap-1 border`}
            >
              <Settings size={14} />
              Custom
            </button>
          </div>
          
          <AnimatePresence>
            {showCustomQueue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
              >
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customQueueLength}
                    onChange={(e) => setCustomQueueLength(e.target.value)}
                    placeholder="Enter queue length (1-1000)"
                    className={`flex-1 ${styles.input} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm`}
                    min="1"
                    max="1000"
                  />
                  <button
                    onClick={handleCustomRandomize}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    <Shuffle size={16} />
                    Generate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className={`${styles.innerCard} rounded-xl p-4 border transition-colors duration-300`}>
          <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>Manual Queue (comma-separated)</label>
          <textarea
            value={localQueueInput}
            onChange={handleLocalQueueChange}
            className={`w-full ${styles.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none`}
            placeholder={`e.g., ${Math.floor(maxTrack * 0.4)}, ${Math.floor(maxTrack * 0.8)}, ${Math.floor(maxTrack * 0.2)}`}
            rows="2"
          />
          <div className={`text-xs ${styles.textMuted} mt-2 flex items-center justify-between`}>
            <span>Queue size: {queue.length} requests</span>
            <span>Range: 0-{maxTrack}</span>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings (Collapsible) */}
      <div className="mb-0">
        <button
          onClick={() => setShowAdvancedSettings(prev => !prev)}
          className={`w-full flex items-center justify-between text-sm font-semibold ${styles.textMuted} uppercase tracking-wider mb-4 hover:${styles.text} transition-colors`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            Advanced Settings
          </div>
          {showAdvancedSettings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        <AnimatePresence>
          {showAdvancedSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className={`${styles.innerCard} rounded-xl p-4 border transition-colors duration-300`}>
                <label className={`block text-sm font-medium ${styles.textMuted} mb-3`}>Direction (SCAN/C-SCAN)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDirection('left')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      direction === 'left' 
                        ? styles.button.active + ' border-2 shadow-lg' 
                        : styles.button.secondary + ' border'
                    }`}
                  >
                    ← Left
                  </button>
                  <button
                    onClick={() => setDirection('right')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      direction === 'right' 
                        ? styles.button.active + ' border-2 shadow-lg' 
                        : styles.button.secondary + ' border'
                    }`}
                  >
                    Right →
                  </button>
                </div>
              </div>
              
              <div className={`${styles.innerCard} rounded-xl p-4 border transition-colors duration-300`}>
                <label className={`block text-sm font-medium ${styles.textMuted} mb-3`}>Graph Rendering Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGraphMode('complete')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      graphMode === 'complete' 
                        ? styles.button.active + ' border-2 shadow-lg' 
                        : styles.button.secondary + ' border'
                    }`}
                  >
                    📊 Complete
                  </button>
                  <button
                    onClick={() => setGraphMode('stepByStep')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      graphMode === 'stepByStep' 
                        ? styles.button.active + ' border-2 shadow-lg' 
                        : styles.button.secondary + ' border'
                    }`}
                  >
                    📈 Step-by-Step
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Controls;