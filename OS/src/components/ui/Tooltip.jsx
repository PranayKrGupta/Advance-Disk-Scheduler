import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes } from '../../utils/theme';

const Tooltip = ({ text, children, theme }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-semibold rounded shadow-xl border whitespace-nowrap z-[100] pointer-events-none ${
              theme === 'dark' ? 'bg-slate-800 text-slate-200 border-white/10' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            {text}
            <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent ${
               theme === 'dark' ? 'border-t-slate-800' : 'border-t-white'
            }`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;