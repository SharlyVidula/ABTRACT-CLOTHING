'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Garment } from '@/lib/garments';
import { BentoGrid, BentoCard } from '@/components/BentoGrid';
import AtelierModal from '@/components/AtelierModal';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import BackgroundScene from '@/components/BackgroundScene';
import CustomDesignModal from '@/components/CustomDesignModal';
import AIAssistant from '@/components/AIAssistant';
import { Heart, Sparkles, ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, LogIn, LogOut, Shield, Check, Crown, Zap, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const {
    user,
    cart,
    products,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    checkout,
    logout,
    genderMode,
    setGenderMode,
  } = useStore();

  const [selectedCheckoutGarment, setSelectedCheckoutGarment] = useState<Garment | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomDesignOpen, setIsCustomDesignOpen] = useState(false);
  type Collection = 'ALL' | 'EXCLUSIVE' | 'UNIVERSE' | 'DELUX';
  const [activeCollection, setActiveCollection] = useState<Collection>('ALL');

  const [isEnteringDelivery, setIsEnteringDelivery] = useState(false);
  const [deliveryFullName, setDeliveryFullName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  React.useEffect(() => {
    if (!isCartOpen) {
      setIsEnteringDelivery(false);
      setDeliveryError('');
    }
  }, [isCartOpen]);

  const handleOpenCheckout = (garment: Garment) => {
    setSelectedCheckoutGarment(garment);
    setIsCheckoutOpen(true);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.garment.price * item.quantity, 0);

  // Collection-based filter
  const genderFilteredProducts = products.filter(p => p.gender === genderMode || p.gender === 'Unisex');
  const filteredProducts = genderFilteredProducts.filter((p) => {
    if (activeCollection === 'EXCLUSIVE') return p.price >= 5000 && p.brand !== 'Universe';
    if (activeCollection === 'UNIVERSE')  return p.brand === 'Universe';
    if (activeCollection === 'DELUX')     return p.price < 5000 && p.brand !== 'Universe';
    return true;
  });

  // Collection definitions with counts
  const COLLECTIONS: { id: Collection; name: string; subtitle: string; icon: React.ReactNode; count: number }[] = [
    { id: 'ALL',       name: 'ALL LINES',  subtitle: 'Full catalogue',            icon: <Sparkles className="w-3.5 h-3.5" />, count: genderFilteredProducts.length },
    { id: 'EXCLUSIVE', name: 'EXCLUSIVE',  subtitle: '≥ LKR 5,000 · Premium',    icon: <Crown    className="w-3.5 h-3.5" />, count: genderFilteredProducts.filter(p => p.price >= 5000 && p.brand !== 'Universe').length },
    { id: 'UNIVERSE',  name: 'UNIVERSE',   subtitle: 'Collab Brand · Streetwear', icon: <Zap      className="w-3.5 h-3.5" />, count: genderFilteredProducts.filter(p => p.brand === 'Universe').length },
    { id: 'DELUX',     name: 'DELUX',      subtitle: '< LKR 5,000 · Accessible',  icon: <Heart    className="w-3.5 h-3.5" />, count: genderFilteredProducts.filter(p => p.price < 5000 && p.brand !== 'Universe').length },
  ];

  const navLinks = [
    { name: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'BESPOKE STUDIO', action: () => setIsCustomDesignOpen(true) },
    { name: 'CAMPAIGNS', action: () => alert('Campaigns coming soon!') },
    { name: 'OUR STORY', action: () => window.location.href = '/our-story' },
  ];

  return (
    <div className={`min-h-screen relative flex flex-col justify-between font-sans text-white select-none transition-all duration-500 bg-[var(--theme-bg)] ${genderMode === 'Female' ? 'theme-female' : 'theme-male'}`}>
      
      {/* Themed animated background scene */}
      <BackgroundScene mode={genderMode} />

      {/* Soft ambient glow blobs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[rgba(var(--theme-glow-rgb),0.08)] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[rgba(var(--theme-glow-rgb),0.08)] blur-[140px] pointer-events-none z-0" />


      {/* Boutique Header Nav */}
      <header className="relative z-30 w-full px-6 md:px-10 lg:px-16 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Abstract Logo" className="w-16 h-16 object-contain rounded-2xl border border-white/15 shadow-[0_0_25px_rgba(var(--theme-glow-rgb),0.2)] hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-sans text-3xl font-black tracking-[0.25em] text-[var(--theme-primary)] theme-glow-text cursor-pointer" onClick={() => setActiveCollection('ALL')}>
                ABSTRACT
              </span>
              <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">
                PREMIUM COUTURE STUDIO
              </span>
            </div>
          </div>

          {/* Global navigation menu */}
          <nav className="hidden lg:flex gap-1 font-mono text-[9px] text-white/50 tracking-widest pl-8 border-l border-white/10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-white/[0.04] transition-all focus:outline-none cursor-pointer uppercase"
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Gender Filter Toggles & Cart Connect Widgets */}
        <div className="flex items-center gap-5">
          
          {/* Dashboard Gender Filter Toggles */}
          <div className="flex gap-1 p-0.5 rounded-xl border border-white/10 bg-white/[0.02]">
            <button
              onClick={() => setGenderMode('Female')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                genderMode === 'Female'
                  ? 'bg-rose-400 text-black font-extrabold shadow-md'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Heart className="w-3 h-3 fill-current" /> FEMALE ♀
            </button>
            <button
              onClick={() => setGenderMode('Male')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                genderMode === 'Male'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Sparkles className="w-3 h-3" /> MALE ♂
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3 border-r border-white/10 pr-4">
              <div className="flex flex-col text-right">
                <span className="font-mono text-[10px] text-white/80 font-bold uppercase">{user.username}</span>
                <span className="text-[8px] text-white/30 font-mono tracking-widest uppercase">{user.role}</span>
              </div>
              {user.role === 'Admin' && (
                <Link href="/admin" className="p-2 border border-white/10 hover:border-[var(--theme-primary)] rounded-lg bg-white/[0.01] text-white/50 hover:text-[var(--theme-primary)] transition-all" title="Admin Control">
                  <Shield className="w-3.5 h-3.5" />
                </Link>
              )}
              <button 
                onClick={logout} 
                className="p-2 border border-white/5 hover:border-red-500/30 rounded-lg bg-white/[0.01] hover:bg-red-500/5 text-white/50 hover:text-red-400 transition-all cursor-pointer"
                title="Disconnect Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider border border-white/10 hover:border-[var(--theme-primary)] px-3 py-1.5 rounded-lg bg-white/[0.01] transition-all text-white/70 hover:text-white"
            >
              <LogIn className="w-3.5 h-3.5" />
              CONNECT
            </Link>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full border border-white/10 hover:border-[var(--theme-primary)] bg-white/[0.02] text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[var(--theme-primary)] text-black font-mono text-[9px] font-extrabold flex items-center justify-center border border-black shadow-[0_0_8px_var(--theme-glow)]">
                {cartItemsCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 flex-1 w-full px-6 md:px-10 lg:px-16 py-10 md:py-16 flex flex-col gap-12">
        
        {/* Banner editorial */}
        <section className="text-center md:text-left max-w-3xl flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.01] w-fit mx-auto md:mx-0"
          >
            {genderMode === 'Female' ? (
              <>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                <span className="font-mono text-[9px] tracking-widest text-rose-200/80 uppercase font-semibold">
                  CUTE BOUTIQUE COLLECTION
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono text-[9px] tracking-widest text-amber-200/80 uppercase font-semibold">
                  REFINED MASCULINE CUTS
                </span>
              </>
            )}
          </motion.div>
          
          {genderMode === 'Female' ? (
            <>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-rose-100 to-rose-200/50 bg-clip-text text-transparent">
                COUTURE PARADISE
              </h1>
              <p className="text-xs md:text-sm text-rose-200/50 leading-relaxed font-light font-sans max-w-2xl">
                Explore our sweet, high-fashion collection of wholesale frocks, elegant pleated skirts, and signature unisex garments. Use the Fit-On Studio to calibrate your dimensions for optimal draped silhouette results.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-black tracking-wider leading-none bg-gradient-to-r from-white via-amber-100 to-amber-200/50 bg-clip-text text-transparent uppercase">
                ESSENTIAL TAILORING
              </h1>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light font-sans max-w-2xl">
                A highly refined collection of executive tailored blazers, heavy wool parkas, slim cargo trousers, and drop-shoulder street t-shirts. Move biometric telemetry sliders to inspect garment sizing clearances.
              </p>
            </>
          )}
        </section>

        {/* Product Catalog Display with filter tabs */}
        <section id="collection" className="space-y-6">
          
          {/* ── Collection Line Tabs ─────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/8 pb-5">
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((col) => {
                const isActive = activeCollection === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollection(col.id)}
                    className={`flex items-center gap-2.5 py-2.5 px-4 rounded-2xl border transition-all focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-white/[0.07] border-white/25 shadow-inner'
                        : 'border-white/6 hover:border-white/18 bg-white/[0.01]'
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? 'text-[var(--theme-primary)]' : 'text-white/35'}`}>
                      {col.icon}
                    </span>
                    <span className="flex flex-col items-start gap-0">
                      <span className={`font-mono text-[10px] font-bold tracking-widest leading-tight ${
                        isActive ? 'text-[var(--theme-primary)]' : 'text-white/60'
                      }`}>{col.name}</span>
                      <span className="font-sans text-[9px] text-white/30">{col.subtitle}</span>
                    </span>
                    <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/10 text-white/80' : 'bg-white/[0.03] text-white/25'
                    }`}>{col.count}</span>
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-[9px] text-[var(--theme-primary)] tracking-widest whitespace-nowrap">
              {filteredProducts.length} PRODUCTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((garment) => (
              <ProductCard
                key={garment.id}
                garment={garment}
                onAddToCartClick={handleOpenCheckout}
              />
            ))}
          </div>
        </section>

        {/* ── Custom Design Inquiries Banner ──────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Accent glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--theme-glow-rgb),0.08)] to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[rgba(var(--theme-glow-rgb),0.05)] blur-3xl pointer-events-none" />

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: 'var(--theme-primary)' }}>
                  BESPOKE SERVICE
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Custom Design Inquiries</h2>
              <p className="text-xs text-white/50 font-sans leading-relaxed mt-2 max-w-md">
                Have a unique vision? Submit a bespoke design request — our studio artisans will craft a personalised quote and collaborate with you on your perfect garment.
              </p>
            </div>

            <button
              onClick={() => setIsCustomDesignOpen(true)}
              className="relative z-10 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-mono text-xs font-bold tracking-wider transition-all cursor-pointer focus:outline-none border whitespace-nowrap"
              style={{
                background: 'rgba(var(--theme-glow-rgb), 0.12)',
                borderColor: 'rgba(var(--theme-glow-rgb), 0.35)',
                color: 'var(--theme-primary)',
                boxShadow: '0 0 20px rgba(var(--theme-glow-rgb), 0.12)',
              }}
            >
              <Palette className="w-4 h-4" />
              REQUEST CUSTOM DESIGN
            </button>
          </motion.div>
        </section>

        {/* Guidance section */}
        <section id="about" className="mt-8">
          <BentoGrid>
            {/* Sizing Instructions Bento Card (Large) */}
            <BentoCard span="md:col-span-2" glowColor="rgba(var(--theme-glow-rgb), 0.05)">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between h-full">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-white/30 tracking-widest font-semibold uppercase">
                      STUDIO MANUAL
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">SIZE SETTERS DETERMINATION</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-2 font-light">
                      Hover over any garment and click **FIT-ON STUDIO**. Use parameters to scale the holographic wireframe mannequin avatar. The engine calculates clearances and alerts if garments are tight.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-white/20 mt-4 md:mt-0">TRANSMISSION: ONLINE</span>
                </div>
                
                <div className="flex-1 space-y-3.5 font-mono text-xs border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 text-white/60">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[var(--theme-primary)] font-bold">01/</span>
                    <span>Click FIT-ON on garment cards</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[var(--theme-primary)] font-bold">02/</span>
                    <span>Set height, chest, waist, and hips</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[var(--theme-primary)] font-bold">03/</span>
                    <span>Verify overlay draping and fit report alerts</span>
                  </div>
                </div>
              </div>
            </BentoCard>

            <BentoCard glowColor="rgba(var(--theme-glow-rgb), 0.05)">
              <div className="flex flex-col justify-between h-full gap-6">
                <div>
                  <span className="font-mono text-[9px] text-[var(--theme-primary)] tracking-widest font-semibold uppercase">
                    QUALITY REPORT
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">SECURE TRANSACTIONS</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed mt-2 font-light">
                    Checkout orders are generated with sizes and quantity details routing to dynamic customer ledgers.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30 border border-white/5 px-2.5 py-1.5 rounded-lg bg-white/[0.01]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>TRANSACTION INTEGRITY: CHECKED</span>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        </section>

      </main>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <CustomDesignModal isOpen={isCustomDesignOpen} onClose={() => setIsCustomDesignOpen(false)} />
      <AtelierModal />
      <AIAssistant />

      {/* SHOPPING CART SLIDE OVER DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setCartOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#0a0a0c]/95 border-l border-white/10 shadow-2xl flex flex-col justify-between p-6 z-10 text-white"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[var(--theme-primary)]" />
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-[var(--theme-primary)] font-semibold">
                      {isEnteringDelivery ? 'DELIVERY DETAILS' : 'SELECTED ITEMS'}
                    </h3>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider font-mono">
                      {isEnteringDelivery ? 'SHIPPING TELEMETRY MATRIX' : 'Total chosen units'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.01] focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isEnteringDelivery ? (
                /* Delivery details input form */
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-wider text-white/50">FULL NAME</label>
                      <input
                        type="text"
                        value={deliveryFullName}
                        onChange={(e) => setDeliveryFullName(e.target.value)}
                        placeholder="e.g. Sharly Vidula"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder:text-white/20"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-wider text-white/50">PHONE NUMBER</label>
                      <input
                        type="text"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder:text-white/20"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-wider text-white/50">SHIPPING ADDRESS</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. 123 Couture Lane"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder:text-white/20"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-wider text-white/50">CITY</label>
                      <input
                        type="text"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        placeholder="e.g. Colombo"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder:text-white/20"
                      />
                    </div>

                    {deliveryError && (
                      <div className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                        {deliveryError}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Item list review */
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/20">
                      <ShoppingBag className="w-8 h-8 mb-2 text-white/10" />
                      <span className="font-mono text-xs tracking-wider">CART IS EMPTY</span>
                      <span className="text-[9px] text-white/30 mt-1">Select items and sizes from catalogue</span>
                    </div>
                  ) : (
                    cart.map((item, index) => {
                      const primaryColor = item.garment.colorTheme.primary;
                      return (
                        <div
                          key={index}
                          className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4 transition-all hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            <div
                              className="w-10 h-10 rounded-xl border flex items-center justify-center bg-black/40 shadow-inner shrink-0 relative overflow-hidden"
                              style={{ borderColor: `${primaryColor}40` }}
                            >
                              {item.garment.image ? (
                                <img src={item.garment.image} alt={item.garment.name} className="w-full h-full object-cover" />
                              ) : (
                                <ShoppingBag className="w-4 h-4" style={{ color: primaryColor }} />
                              )}
                            </div>
                            
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-[11px] font-bold text-white truncate uppercase">
                                {item.garment.name}
                              </span>
                              <div className="flex flex-wrap gap-x-2 text-[9px] text-white/40 font-mono mt-0.5">
                                <span>SIZE: {item.size}</span>
                                <span>QTY: {item.quantity}</span>
                                <span style={{ color: primaryColor }}>{item.paymentMethod}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5 shrink-0">
                            <span className="font-mono text-xs font-semibold text-white/80">
                              {item.garment.price * item.quantity} LKR
                            </span>
                            
                            <button
                              onClick={() => removeFromCart(index)}
                              className="p-2 rounded-lg border border-white/5 hover:border-red-500/20 bg-white/[0.01] hover:bg-red-500/5 text-white/40 hover:text-red-400 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Checkout CTA */}
              {cart.length > 0 && (
                <div className="border-t border-white/10 pt-4 space-y-4">
                  <div className="space-y-1.5 font-mono text-[11px] text-white/60">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white/80">{cartTotal} LKR</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-2 mt-2 font-bold text-xs text-white/85">
                      <span>TOTAL DUE:</span>
                      <span className="text-[var(--theme-primary)] theme-glow-text">{cartTotal} LKR</span>
                    </div>
                  </div>

                  {isEnteringDelivery ? (
                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={() => {
                          if (!deliveryFullName.trim() || !deliveryPhone.trim() || !deliveryAddress.trim() || !deliveryCity.trim()) {
                            setDeliveryError('ALL TELEMETRY FIELDS MUST BE FULLY RESOLVED');
                            return;
                          }

                          checkout({
                            fullName: deliveryFullName.trim(),
                            phone: deliveryPhone.trim(),
                            address: deliveryAddress.trim(),
                            city: deliveryCity.trim()
                          });

                          alert('ORDER PLACED SUCCESSFULLY.');
                          
                          // Clean fields
                          setDeliveryFullName('');
                          setDeliveryPhone('');
                          setDeliveryAddress('');
                          setDeliveryCity('');
                          setIsEnteringDelivery(false);
                          setDeliveryError('');
                        }}
                        className="w-full py-4 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/90 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shadow-lg"
                      >
                        CONFIRM & PLACE ORDER
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setIsEnteringDelivery(false);
                          setDeliveryError('');
                        }}
                        className="w-full py-3.5 rounded-xl font-mono text-xs tracking-wider font-semibold border border-white/10 hover:border-white/20 hover:bg-white/[0.02] active:scale-98 transition-all flex items-center justify-center gap-2 text-white/60 hover:text-white bg-black/35 cursor-pointer"
                      >
                        BACK TO CART
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEnteringDelivery(true);
                        setDeliveryError('');
                      }}
                      className="w-full py-4 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/90 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shadow-lg"
                    >
                      PROCEED TO CHECKOUT
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Atelier fitting booth */}
      <AtelierModal />

      {/* Checkout selection parameters dialog */}
      <CheckoutModal
        garment={selectedCheckoutGarment}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-30 border-t border-white/5 bg-black/40 backdrop-blur-md py-8 px-6 text-white/30 text-[9px] font-mono mt-12">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Abstract Logo" className="w-12 h-12 object-contain rounded-xl border border-white/10 opacity-75 shadow-[0_0_15px_rgba(var(--theme-glow-rgb),0.1)]" />
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-extrabold text-white/60 tracking-wider">ABSTRACT</span>
              <span className="text-[7.5px] text-white/30 tracking-widest uppercase">PREMIUM COUTURE STUDIO</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>SYS: ABSTRACT_CHECKOUT_CORE // CERTIFIED_TRANSACTIONS</span>
          </div>
          <span>&copy; 2026 ABSTRACT ONLINE BOUTIQUE COUTURE. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
      
    </div>
  );
}
