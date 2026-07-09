'use client';

import React, { useState } from 'react';
import { Garment } from '@/lib/garments';
import { useAtelier } from '@/context/AtelierContext';
import { Eye, ShoppingCart, Sparkles, Crown, Zap, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductGalleryModal from './ProductGalleryModal';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  garment: Garment;
  onAddToCartClick: (garment: Garment) => void;
}

export default function ProductCard({ garment, onAddToCartClick }: ProductCardProps) {
  const { setSelectedGarment, setIsAtelierOpen } = useAtelier();
  const { trackEvent } = useStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleFitOn = () => {
    setSelectedGarment(garment);
    setIsAtelierOpen(true);
  };

  // Collection badge
  const isUniverse = garment.brand === 'Universe';
  const isExclusive = !isUniverse && garment.price >= 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.05, zIndex: 50 }}
      onClick={() => setShowOverlay((prev) => !prev)}
      onMouseLeave={() => setShowOverlay(false)}
      className="relative overflow-hidden rounded-[24px] flex flex-col group cursor-pointer"
      style={{
        height: '340px',
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 48px -12px rgba(0,0,0,0.55)',
      }}
    >
      {/* ── Image (full-bleed hero) ───────────────────────────────────────── */}
      <div className="absolute inset-0">
        {garment.image ? (
          <img
            src={garment.image}
            alt={garment.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              showOverlay
                ? 'opacity-30 scale-105'
                : 'opacity-80 group-hover:opacity-30 group-hover:scale-105'
            }`}
          />
        ) : (
          /* Placeholder gradient when no image is set */
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse at 60% 40%, ${garment.colorTheme.primary}22 0%, transparent 70%),
                           linear-gradient(160deg, #1a1520 0%, #0d0a10 100%)`,
            }}
          />
        )}

        {/* Gradient drape — only at the very bottom for name legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Very subtle top fade for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      </div>

      {/* ── Top badges row ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-start justify-between p-4">
        {/* Category tag */}
        <span className="font-mono text-[9px] tracking-widest font-bold uppercase px-2.5 py-1 rounded-md border border-white/15 bg-black/50 text-white/85 backdrop-blur-sm">
          {garment.category}
        </span>

        {/* Price pill */}
        <span className="font-mono text-[10px] font-extrabold text-white bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
          {garment.price.toLocaleString()} LKR
        </span>
      </div>

      {/* ── Collection badge (mid-left) ────────────────────────────────────── */}
      {(isUniverse || isExclusive) && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {isUniverse ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[8px] tracking-widest font-bold border"
              style={{ background: 'rgba(0,229,255,0.10)', borderColor: 'rgba(0,229,255,0.3)', color: '#00e5ff' }}
            >
              <Zap className="w-2.5 h-2.5" />
              UNIVERSE
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[8px] tracking-widest font-bold border"
              style={{ background: 'rgba(217,119,6,0.10)', borderColor: 'rgba(217,119,6,0.3)', color: '#d97706' }}
            >
              <Crown className="w-2.5 h-2.5" />
              EXCLUSIVE
            </div>
          )}
        </div>
      )}

      {/* ── Bottom: name only (resting state) ────────────────────────────── */}
      <div className={`relative z-10 mt-auto p-4 transition-opacity duration-300 ${
        showOverlay ? 'opacity-0' : 'group-hover:opacity-0'
      }`}>
        <h3 className="font-sans text-base font-bold tracking-tight text-white leading-snug drop-shadow-lg">
          {garment.name}
        </h3>
        <p className="text-[10px] text-white/50 font-mono mt-0.5">{garment.gender} · {garment.category}</p>
      </div>

      {/* ── Hover overlay with full info + actions ────────────────────────── */}
      <div
        className={`absolute inset-0 z-20 transition-all duration-300 flex flex-col items-center justify-center p-5 gap-4 ${
          showOverlay
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
        }`}
        style={{ 
          background: 'rgba(8,7,12,0.72)', 
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      >
        {/* Sparkle label */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest font-bold"
          style={{ color: 'var(--theme-primary)' }}>
          <Sparkles className="w-3 h-3 animate-pulse" />
          COUTURE STUDIO ONLINE
        </div>

        {/* Product name */}
        <div className="text-center">
          <h3 className="font-sans text-base font-bold text-white leading-tight">{garment.name}</h3>
          <p className="text-[10px] text-white/55 font-sans leading-relaxed mt-2 line-clamp-3">
            {garment.description}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-[185px]">
          <button
            onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); trackEvent('view_details', { garmentId: garment.id, garmentName: garment.name }); }}
            className="w-full py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all border flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none bg-black/50 hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <MonitorPlay className="w-3.5 h-3.5" /> VIEW DETAILS
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleFitOn(); }}
            className="w-full py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all border flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none bg-black/50"
            style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)', boxShadow: '0 0 12px var(--theme-glow)' }}
          >
            <Eye className="w-3.5 h-3.5" /> FIT-ON STUDIO
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCartClick(garment); }}
            className="w-full py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-wider bg-white text-black hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> ADD TO CART
          </button>
        </div>

        <span className="font-mono text-[8px] text-white/25 tracking-wider">
          {garment.gender === 'Unisex' ? 'UNISEX FIT' : `${garment.gender.toUpperCase()} COLLECTION`}
          {garment.brand ? ` · ${garment.brand.toUpperCase()}` : ''}
        </span>
      </div>

      <ProductGalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        garment={garment} 
      />
    </motion.div>
  );
}
