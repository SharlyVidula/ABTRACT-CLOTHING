'use client';

import React from 'react';
import { useAtelier } from '@/context/AtelierContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Cpu, Sparkles, ShoppingBag, Award, Coins, CreditCard, Database, Banknote, ShieldCheck } from 'lucide-react';
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
  const [showStudioCheckout, setShowStudioCheckout] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState('Cash on Delivery');
  const [mobileTab, setMobileTab] = React.useState<'calibrator' | 'advisory'>('calibrator');

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
          className="relative w-full max-w-5xl glass rounded-[24px] md:rounded-[36px] overflow-y-auto md:overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[80vh] text-white"
        >
          {/* Mobile Tabs Header */}
          <div className="flex md:hidden border-b border-white/10 w-full pt-16 pb-0 px-6 gap-2 shrink-0">
            <button
              onClick={() => setMobileTab('calibrator')}
              className={`flex-1 pb-3 text-xs font-mono font-bold border-b-2 tracking-wider transition-all cursor-pointer focus:outline-none ${
                mobileTab === 'calibrator'
                  ? 'border-[var(--theme-primary)] text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              1. CALIBRATOR
            </button>
            <button
              onClick={() => setMobileTab('advisory')}
              className={`flex-1 pb-3 text-xs font-mono font-bold border-b-2 tracking-wider transition-all cursor-pointer focus:outline-none ${
                mobileTab === 'advisory'
                  ? 'border-[var(--theme-primary)] text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              2. AI ADVISORY
            </button>
          </div>
          {/* Close & Reset Controls */}
          <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
            <button
              onClick={resetAtelier}
              className="p-3 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.02] cursor-pointer"
              title="Reset Calibrator"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAtelierOpen(false)}
              className="p-3 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.02] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Left Column: Biometrics Input & Size Selection (40% width) */}
          <div className={`w-full md:w-[40%] border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 flex-col justify-between md:overflow-y-auto ${mobileTab === 'calibrator' ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex flex-col gap-6">
              <div className="pr-20 md:pr-0">
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
                <div className="grid grid-cols-5 gap-2">
                  {(['S', 'M', 'L', 'XL', '2XL'] as const).map((size) => {
                    const isSelected = selectedSize === size;
                    const isDisabled = selectedGarment?.disabledSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        disabled={isDisabled}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-lg font-mono text-xs font-bold border transition-all duration-300 focus:outline-none cursor-pointer ${
                          isDisabled
                            ? 'border-transparent text-white/20 bg-white/[0.005] cursor-not-allowed line-through'
                            : isSelected
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

              {/* Mobile CTA */}
              <button
                type="button"
                onClick={() => {
                  runTryOn();
                  setMobileTab('advisory');
                }}
                disabled={isLoading}
                className="md:hidden w-full py-4 mt-4 rounded-xl font-mono text-xs tracking-wider font-bold bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 border border-[var(--theme-border)] shadow-[0_4px_12px_var(--theme-glow)] cursor-pointer disabled:opacity-50"
              >
                <Cpu className="w-4 h-4" />
                {isLoading ? 'ANALYSING BIOMETRICS...' : 'GENERATE AI FIT ADVISORY'}
              </button>
            </div>
          </div>

          {/* Right Column: AI Advisory Report (60% width) */}
          <div className={`w-full md:w-[60%] p-6 md:p-8 flex-col justify-between md:overflow-y-auto bg-black/20 relative ${mobileTab === 'advisory' ? 'flex' : 'hidden md:flex'}`}>
            
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
                  setQuantity(1);
                  setPaymentMethod('Cyber-Credits');
                  setShowStudioCheckout(true);
                }}
                className="py-4 px-6 rounded-xl font-mono text-sm tracking-wider font-semibold border border-white/10 hover:border-[var(--theme-primary)] hover:bg-white/[0.02] active:scale-98 transition-all flex items-center justify-center gap-2 text-white/80 hover:text-white bg-black/35 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>
            </div>
          </div>

          {/* Studio Checkout Overlay Card */}
          <AnimatePresence>
            {showStudioCheckout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-full max-w-md glass rounded-[24px] border border-white/10 shadow-2xl p-6 md:p-8 text-white relative flex flex-col gap-5 max-h-[90%] overflow-y-auto"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowStudioCheckout(false)}
                    className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.01] focus:outline-none cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header */}
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                    <span className="font-mono text-[9px] text-[var(--theme-primary)] tracking-widest font-semibold uppercase">
                      STUDIO PARAMETERS SELECTOR
                    </span>
                    <h3 className="text-xl font-bold tracking-tight uppercase" style={{ color: selectedGarment.colorTheme.primary }}>
                      {selectedGarment.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-sm font-semibold text-white/80">
                        {selectedGarment.price * quantity} LKR
                      </span>
                      <span className="font-mono text-[10px] bg-white/15 px-2 py-0.5 rounded text-white/90">
                        CALIBRATED SIZE: {selectedSize}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs tracking-wider text-white/60">QUANTITY</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.01] flex items-center justify-center font-bold text-white transition-all focus:outline-none cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-base font-bold w-6 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.01] flex items-center justify-center font-bold text-white transition-all focus:outline-none cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-white/30 font-mono self-center">MAXIMUM: 10 UNITS</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs tracking-wider text-white/60">PAYMENT ROUTE</span>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {[
                        { name: 'Cyber-Credits', icon: Coins, desc: 'Store digital credits', comingSoon: true },
                        { name: 'Credit Card', icon: CreditCard, desc: 'Visa/MC Secure Auth', comingSoon: true },
                        { name: 'Solana Network', icon: Database, desc: 'Web3 transaction matrix', comingSoon: true },
                        { name: 'Cash on Delivery', icon: Banknote, desc: 'Pay with cash upon package arrival', comingSoon: false },
                      ].map((opt) => {
                        const isSelected = paymentMethod === opt.name;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            disabled={opt.comingSoon}
                            onClick={() => !opt.comingSoon && setPaymentMethod(opt.name)}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all duration-300 text-left focus:outline-none ${
                              opt.comingSoon
                                ? 'border-white/5 opacity-40 cursor-not-allowed'
                                : isSelected
                                ? 'border-white bg-white/[0.04] shadow-[0_0_10px_rgba(255,255,255,0.05)] cursor-pointer'
                                : 'border-white/5 hover:border-white/10 text-white/60 hover:text-white bg-white/[0.01] cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-semibold">{opt.name}</span>
                                  {opt.comingSoon && (
                                    <span className="text-[8px] font-mono font-bold bg-white/10 text-white/50 px-1 py-0.5 rounded tracking-wide uppercase">
                                      Coming Soon
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-white/30">{opt.desc}</span>
                              </div>
                            </div>
                            <div 
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                opt.comingSoon ? 'border-white/10 bg-transparent' : isSelected ? 'border-white' : 'border-white/20'
                              }`}
                            >
                              {isSelected && !opt.comingSoon && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confirm CTA */}
                  <button
                    onClick={() => {
                      addToCart(selectedGarment, selectedSize, quantity, paymentMethod);
                      setCartOpen(true);
                      setIsAtelierOpen(false);
                      setShowStudioCheckout(false);
                    }}
                    className="w-full py-4 mt-2 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    CONFIRM CART INGESTION
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-white/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>TRANSACTIONS ROUTED THROUGH SECURE CORE PROTOCOL</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
