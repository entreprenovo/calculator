
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Target, Lightning, TrendUp } from 'phosphor-react';
import ROICalculator from './components/ROICalculator.tsx';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="selection:bg-brand-accent/30 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600"
        >
          Unlock Your Business's True Potential
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="mt-4 md:mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Our AI Automation ROI Calculator precisely quantifies the value AI can bring to your operations. Discover hidden savings, boost productivity, and drive revenue growth in just 2 minutes.
        </motion.p>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
           className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent/10 p-3 rounded-full"><Target size={24} className="text-brand-accent"/></div>
              <h3 className="text-lg font-bold text-slate-800">Quantify Savings</h3>
            </div>
            <p className="mt-2 text-slate-500">See exact figures on how much you can save by automating repetitive tasks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent/10 p-3 rounded-full"><Lightning size={24} className="text-brand-accent"/></div>
              <h3 className="text-lg font-bold text-slate-800">Boost Productivity</h3>
            </div>
            <p className="mt-2 text-slate-500">Understand the impact of freeing up your team to focus on strategic initiatives.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent/10 p-3 rounded-full"><TrendUp size={24} className="text-brand-accent"/></div>
              <h3 className="text-lg font-bold text-slate-800">Drive Growth</h3>
            </div>
            <p className="mt-2 text-slate-500">Project potential revenue increases through improved efficiency and client engagement.</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        <motion.button
          onClick={openModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 1.0 }}
          className="fixed bottom-6 right-6 z-40 bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/30 flex items-center gap-3 transition-all duration-300"
          aria-label="Open ROI Calculator"
        >
          <Calculator size={20} weight="bold" />
          Calculate Your ROI
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-brand-accent-dark"></span>
          </span>
        </motion.button>
      </AnimatePresence>

      <ROICalculator
        isOpen={isModalOpen}
        onClose={closeModal}
        config={{ serviceCost: 7500, bookingUrl: 'https://calendly.com/tales-couto/30min' }}
      />
    </div>
  );
}

export default App;