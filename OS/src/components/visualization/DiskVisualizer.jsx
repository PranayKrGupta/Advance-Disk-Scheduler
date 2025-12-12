import React from 'react';
import { motion } from 'framer-motion';
import { themes } from '../../utils/theme';

const DiskVisualizer = ({ algorithm, currentStep, sequence, color, maxTrack, theme }) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const styles = themes[theme];
  
  const calculateDotSize = () => {
    const uniqueTracks = [...new Set(sequence.slice(1))];
    const queueSize = uniqueTracks.length;
    const sortedTracks = uniqueTracks.sort((a, b) => a - b);
    let minDistance = maxTrack;
    for (let i = 1; i < sortedTracks.length; i++) {
      minDistance = Math.min(minDistance, sortedTracks[i] - sortedTracks[i - 1]);
    }
    if (queueSize > 30 || minDistance < 5) return { dot: 3, current: 5, text: 8 };
    if (queueSize > 20 || minDistance < 10) return { dot: 4, current: 6, text: 9 };
    return { dot: 5, current: 8, text: 10 };
  };
  
  const sizes = calculateDotSize();
  
  const getPosition = (track) => {
    const safeTrack = Number(track) || 0;
    const safeMax = Number(maxTrack) || 199;
    const normalizedTrack = safeTrack / safeMax;
    const angle = normalizedTrack * Math.PI * 2;
    const radius = 30 + normalizedTrack * (maxRadius - 30);
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: angle
    };
  };
  
  const safeIndex = Math.min(currentStep, sequence.length - 1);
  const currentTrack = sequence[safeIndex] !== undefined ? sequence[safeIndex] : 0;
  const currentPos = getPosition(currentTrack);
  
  return (
    <div className="flex flex-col">
      <div className="relative">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <radialGradient id={`diskGradient-${algorithm}-dark`}>
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
             <radialGradient id={`diskGradient-${algorithm}-light`}>
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
          </defs>
          
          <g className="disk-static">
            <circle cx={centerX} cy={centerY} r={maxRadius} fill={theme === 'dark' ? `url(#diskGradient-${algorithm}-dark)` : `url(#diskGradient-${algorithm}-light)`} stroke={styles.disk.stroke} strokeWidth="2" />
            
            {[0.3, 0.5, 0.7, 0.9].map((ratio, i) => (
              <circle key={i} cx={centerX} cy={centerY} r={30 + (maxRadius - 30) * ratio} fill="none" stroke={styles.disk.stroke} strokeWidth="1" opacity="0.4" />
            ))}
            
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={centerX + Math.cos(angle) * 30}
                  y1={centerY + Math.sin(angle) * 30}
                  x2={centerX + Math.cos(angle) * maxRadius}
                  y2={centerY + Math.sin(angle) * maxRadius}
                  stroke={styles.disk.stroke}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              );
            })}
            
            {sequence.slice(1).map((track, i) => {
              const pos = getPosition(track);
              const seqIndex = i + 1;
              const isCurrent = seqIndex === currentStep;
              const isPrevious = seqIndex === currentStep - 1;
              const isHighlighted = isCurrent || isPrevious;

              let dotColor = styles.disk.stroke;
              let dotRadius = sizes.dot;
              let dotOpacity = 0.3;
              
              if (isCurrent) {
                dotColor = '#4ade80';
                dotRadius = 8;
                dotOpacity = 1;
              } else if (isPrevious) {
                dotColor = '#fbbf24';
                dotRadius = 6;
                dotOpacity = 1;
              }
              
              return (
                <g key={i}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    initial={false}
                    animate={{ r: dotRadius, fill: dotColor, opacity: dotOpacity }}
                    transition={{ duration: 0.3 }}
                  />
                  {isHighlighted && (
                    <text
                      x={pos.x}
                      y={pos.y - (dotRadius + 5)}
                      fill={dotColor}
                      fontSize={sizes.text}
                      textAnchor="middle"
                      className="pointer-events-none"
                      style={{ fontWeight: 'bold' }}
                    >
                      {track}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          
          <circle cx={centerX} cy={centerY} r="8" fill={styles.disk.spindle} stroke={styles.disk.stroke} strokeWidth="2" />
          
          <motion.circle
            initial={false}
            animate={{
              cx: currentPos.x,
              cy: currentPos.y,
              stroke: color
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            r={sizes.current}
            fill="none"
            strokeWidth="2"
            opacity="0.8"
          />
        </svg>
        
        {/* Legend */}
        <div className={`absolute top-3 right-3 rounded-lg p-2 border shadow-lg ${theme === 'dark' ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${styles.textMuted}`}>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${styles.textMuted}`}>Previous</span>
          </div>
        </div>
      </div>

      <div className={`mt-2 rounded-xl p-3 border text-center ${styles.innerCard}`}>
        <div className={`text-xs ${styles.textMuted} mb-1`}>Current Track</div>
        <div className="text-2xl font-bold" style={{ color }}>{currentTrack}</div>
      </div>
    </div>
  );
};

export default DiskVisualizer;