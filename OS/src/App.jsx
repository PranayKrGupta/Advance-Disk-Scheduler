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
  )
    
}

export default App
