import React from 'react';
import { themes, safeNum } from '../../utils/theme';

const MetricsDisplay = ({ result, queue, currentStep, theme }) => {
  const stepsSoFar = result.steps.slice(0, currentStep);
  const currentSeekCount = stepsSoFar.reduce((acc, curr) => acc + curr.distance, 0);
  const currentAvgSeek = currentStep > 0 ? currentSeekCount / currentStep : 0;
  const currentThroughput = currentSeekCount > 0 ? currentStep / currentSeekCount : 0;
  
  const styles = themes[theme];

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-3 gap-3">
        <div className={`${styles.innerCard} rounded-lg p-2 border text-center transition-colors duration-300`}>
          <div className={`text-[10px] ${styles.textMuted} uppercase tracking-wide`}>Total Seek</div>
          <div className={`text-lg font-bold ${styles.text}`}>{safeNum(currentSeekCount)}</div>
        </div>
        <div className={`${styles.innerCard} rounded-lg p-2 border text-center transition-colors duration-300`}>
          <div className={`text-[10px] ${styles.textMuted} uppercase tracking-wide`}>Avg Seek</div>
          <div className={`text-lg font-bold ${styles.text}`}>{safeNum(currentAvgSeek, 1)}</div>
        </div>
        <div className={`${styles.innerCard} rounded-lg p-2 border text-center transition-colors duration-300`}>
          <div className={`text-[10px] ${styles.textMuted} uppercase tracking-wide`}>Throughput</div>
          <div className={`text-lg font-bold ${styles.text}`}>{safeNum(currentThroughput, 3)}</div>
        </div>
      </div>
      
      <div className={`${styles.innerCard} rounded-lg p-3 border transition-colors duration-300`}>
        <div className={`text-[10px] ${styles.textMuted} uppercase tracking-wide mb-2`}>Queue Progress</div>
        <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {queue.map((track, i) => {
            const isProcessed = result.sequence.slice(1, currentStep + 1).includes(track);
            const isCurrent = result.sequence[currentStep] === track;
            
            return (
              <span
                key={i}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm ${
                  isCurrent ? 'bg-blue-500/40 border border-blue-400 text-white' :
                  isProcessed ? (theme === 'dark' ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-500') : 
                  (theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-white border-slate-200 text-slate-400')
                }`}
              >
                {track}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;