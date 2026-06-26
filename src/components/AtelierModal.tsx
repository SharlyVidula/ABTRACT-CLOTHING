'use client';

import React from 'react';
import { useAtelier } from '@/context/AtelierContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Cpu, Sparkles, ShoppingBag, Award } from 'lucide-react';
import MeasurementForm from './MeasurementForm';
import { useStore } from '@/context/StoreContext';

export default function AtelierModal() {
  const {
    isAtelierOpen,
    setIsAtelierOpen,
    measurements,
    selectedGarment,
    selectedSize,
    setSelectedSize,
    fitAdvisory,
    isLoading,
    runTryOn,
    resetAtelier,
  } = useAtelier();

  const { addToCart, setCartOpen } = useStore();

  if (!isAtelierOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 select-none">
        
        {/* Animated Laser Grid Background */}
        <div className="absolute inset-0 grid-drift-effect opacity-25 pointer-events-none" />
        
        {/* Ambient Theme Glow */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-10 transition-colors duration-1000 pointer-events-none"
          style={{ backgroundColor: selectedGarment.colorTheme.primary }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-5xl glass rounded-[36px] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh] text-white"
        >
          {/* Close & Reset Controls */}
          <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
            <button
              onClick={resetAtelier}
              className="p-3 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.02]"
              title="Reset Calibrator"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAtelierOpen(false)}
              className="p-3 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.02]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Left Column: Biometrics Input & Size Selection (40% width) */}
          <div className="w-full md:w-[40%] border-r border-white/5 p-8 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[var(--theme-primary)] uppercase font-semibold">
                  STUDIO ATELIER V2.0
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  CALIBRATOR
                </h2>
              </div>

              {/* Slider Controls */}
              <MeasurementForm />

              {/* Sizing Grid Custom Selector */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
                <span className="font-mono text-xs tracking-wider text-white/50">CHOOSE TARGET FIT SIZE</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['S', 'M', 'L', 'XL'] as const).map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-lg font-mono text-xs font-bold border transition-all duration-300 focus:outline-none ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                            : 'border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/[0.01]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Advisory Report (60% width) */}
          <div className="w-full md:w-[60%] p-8 flex flex-col justify-between overflow-y-auto bg-black/20 relative">
            
            <div className="flex flex-col gap-6">
              {/* Garment Title and Spec */}
              <div>
                <span 
                  className="font-mono text-[10px] tracking-widest font-semibold uppercase"
                  style={{ color: selectedGarment.colorTheme.primary }}
                >
                  {selectedGarment.category}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                  {selectedGarment.name}
                </h3>
                <div className="text-sm font-semibold font-mono text-white/60 mt-1">
                  {selectedGarment.price} LKR
                </div>
              </div>

              {/* Fit Advisory Box */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-t-[var(--theme-primary)] border-white/5 animate-spin" />
                      <Sparkles className="w-5 h-5 text-[var(--theme-primary)] animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] tracking-widest text-[var(--theme-primary)] font-semibold">
                        A.I. COMPILING FIT ANALYSIS...
                      </span>
                      <span className="font-mono text-[9px] text-white/40 tracking-wider">
                        EVALUATING FABRIC WEIGHT & BIOMETRICS
                      </span>
                    </div>
                  </div>
                ) : fitAdvisory ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Recommended Size Alert */}
                    <div className="flex items-center gap-4 p-5 rounded-2xl border border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-[var(--theme-primary)] animate-pulse" />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-[var(--theme-primary)] font-semibold uppercase">
                          AI RECOMMENDATION
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          Optimal size for your metrics is{' '}
                          <span className="text-[var(--theme-primary)] font-mono text-base font-extrabold ml-1 underline underline-offset-4 decoration-wavy">
                            {fitAdvisory.recommendedSize}
                          </span>
                        </h4>
                      </div>
                    </div>

                    {/* Fit & Feel Narrative */}
                    <div className="flex flex-col gap-2 p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                      <span className="font-mono text-[10px] tracking-wider text-white/40 font-semibold">
                        MATERIAL FIT & FEEL SIMULATION
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed font-light">
                        {fitAdvisory.fitAndFeel}
                      </p>
                    </div>

                    {/* Comparative Fit Matrices */}
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[10px] tracking-wider text-white/40 font-semibold">
                        FIT VARIATION BY SIZE
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Size Down */}
                        <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] text-rose-400 font-bold">SIZE DOWN (-1)</span>
                          <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                            {fitAdvisory.sizeComparisons.sizeDown}
                          </p>
                        </div>
                        {/* Selected Size */}
                        <div className="p-4 rounded-xl border border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/5 flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] text-[var(--theme-primary)] font-bold">
                            CURRENT ({selectedSize})
                          </span>
                          <p className="text-[10px] text-white/80 leading-relaxed font-mono">
                            {fitAdvisory.sizeComparisons.selected}
                          </p>
                        </div>
                        {/* Size Up */}
                        <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] text-cyan-400 font-bold">SIZE UP (+1)</span>
                          <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                            {fitAdvisory.sizeComparisons.sizeUp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[40vh] flex flex-col items-center justify-center gap-3 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01] p-6">
                    <Cpu className="w-8 h-8 text-white/20 animate-pulse" />
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-widest text-white/40 font-semibold uppercase">
                        SYSTEM STANDBY
                      </span>
                      <p className="text-xs text-white/30 max-w-[280px] leading-relaxed mt-1">
                        Calibrate your biometric measurements on the left panel, select your target fit size, and generate an AI report.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row gap-3 mt-8 border-t border-white/10 pt-6">
              <button
                onClick={runTryOn}
                disabled={isLoading}
                className="flex-1 py-4 rounded-xl font-mono text-sm tracking-wider font-semibold bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white hover:brightness-110 active:scale-98 transition-all shadow-[0_4px_15px_var(--theme-glow)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[var(--theme-border)] theme-glow-text cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                {fitAdvisory ? 'RE-GENERATE FIT ANALYSIS' : 'GENERATE AI FIT ADVISORY'}
              </button>

              <button
                onClick={() => {
                  addToCart(selectedGarment, selectedSize, 1, 'Cyber-Credits');
                  setCartOpen(true);
                  setIsAtelierOpen(false);
                }}
                className="py-4 px-6 rounded-xl font-mono text-sm tracking-wider font-semibold border border-white/10 hover:border-[var(--theme-primary)] hover:bg-white/[0.02] active:scale-98 transition-all flex items-center justify-center gap-2 text-white/80 hover:text-white bg-black/35 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
