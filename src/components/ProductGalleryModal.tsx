'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Garment } from '@/lib/garments';

interface ProductGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  garment: Garment;
}

export default function ProductGalleryModal({ isOpen, onClose, garment }: ProductGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomedOpen, setIsZoomedOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Swipe gesture handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const isExclusive = !garment.brand || garment.brand !== 'Universe' ? garment.price >= 5000 : false;
  
  const baseImages = garment.images && garment.images.length > 0 ? garment.images : [garment.image];
  const mediaItems: any[] = baseImages.map(img => ({ type: 'image', src: img }));

  if (baseImages.length === 1 && baseImages[0]) {
    mediaItems.push({ type: 'image', src: baseImages[0], flip: true });
    mediaItems.push({ type: 'image', src: baseImages[0], filter: 'grayscale opacity-80' });
  }

  if (garment.video) {
    mediaItems.push({ type: 'video', src: garment.video });
  } else if (isExclusive) {
    mediaItems.push({ type: 'video' }); // Fallback simulated runway
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-auto max-h-[90vh] md:max-h-none bg-[#0c0a10] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/50 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Section */}
            <div className="w-full md:w-2/3 h-[45vh] md:h-[80vh] relative bg-black flex flex-col shrink-0">
              
              {/* Media Content with Arrows */}
              <div 
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4 group/carousel"
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    {mediaItems[currentIndex].type === 'image' ? (
                      mediaItems[currentIndex].src ? (
                        <img 
                          src={mediaItems[currentIndex].src} 
                          alt={`${garment.name} view ${currentIndex + 1}`} 
                          className={`max-w-full max-h-full object-contain rounded-xl transition-all duration-500 cursor-zoom-in ${mediaItems[currentIndex].flip ? 'scale-x-[-1]' : ''} ${mediaItems[currentIndex].filter || ''}`} 
                          onClick={() => setIsZoomedOpen(true)}
                        />
                      ) : (
                        <div className="w-64 h-64 border border-white/10 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-white/20" />
                        </div>
                      )
                    ) : (
                      mediaItems[currentIndex].src ? (
                        <video 
                          src={mediaItems[currentIndex].src}
                          controls
                          autoPlay
                          muted
                          loop
                          className="max-w-full max-h-full object-contain rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative bg-[#050505] rounded-xl border border-white/5">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--theme-primary)]">
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                              <Play className="w-16 h-16 opacity-30 mb-4" />
                            </motion.div>
                            <span className="font-mono text-sm tracking-widest font-bold opacity-50">EXCLUSIVE RUNWAY FOOTAGE</span>
                            <span className="font-mono text-[10px] text-white/30 mt-2">SIMULATED PLAYBACK</span>
                          </div>
                        </div>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Left Arrow */}
                <button 
                  onClick={handlePrev} 
                  className="absolute left-6 z-30 p-3 bg-black/40 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 opacity-100 md:opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                {/* Right Arrow */}
                <button 
                  onClick={handleNext} 
                  className="absolute right-6 z-30 p-3 bg-black/40 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 opacity-100 md:opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 z-30 flex items-center justify-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                  <span className="font-mono text-[10px] text-white/50 tracking-widest font-bold">
                    {mediaItems[currentIndex].type === 'image' ? 'GALLERY' : 'RUNWAY'} {currentIndex + 1}/{mediaItems.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-white/10 bg-gradient-to-b from-[#110e18] to-[#0c0a10]">
              <div className="mb-auto space-y-6">
                <div>
                  <span className="font-mono text-[10px] text-[var(--theme-primary)] tracking-widest font-bold uppercase mb-2 block">
                    {garment.category} · {garment.gender}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-sans font-black text-white leading-tight">
                    {garment.name}
                  </h2>
                  <div className="text-xl font-mono text-white/80 mt-2">
                    {garment.price.toLocaleString()} LKR
                  </div>
                </div>

                <p className="text-sm text-white/60 font-sans leading-relaxed">
                  {garment.description}
                </p>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono text-white/40 border-b border-white/5 pb-2">
                    <span>MATERIAL</span>
                    <span className="text-white/80 text-right">Synthetic Cyber-Blend</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-white/40 border-b border-white/5 pb-2">
                    <span>FIT</span>
                    <span className="text-white/80 text-right">Ergonomic Tailored</span>
                  </div>
                  {isExclusive && (
                    <div className="flex justify-between items-center text-xs font-mono text-amber-500/50 pb-2">
                      <span>STATUS</span>
                      <span className="text-amber-500 font-bold text-right flex items-center gap-1">
                        EXCLUSIVE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-mono text-[11px] font-bold tracking-wider bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/5"
                >
                  RETURN TO CATALOGUE
                </button>
              </div>
            </div>

            {/* Zoom modal overlay */}
            <AnimatePresence>
              {isZoomedOpen && mediaItems[currentIndex].type === 'image' && (
                <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4">
                  {/* Controls */}
                  <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <button
                      onClick={() => setZoomScale(prev => Math.min(prev + 0.5, 3))}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10 text-xs font-mono cursor-pointer"
                    >
                      ZOOM +
                    </button>
                    <button
                      onClick={() => setZoomScale(prev => Math.max(prev - 0.5, 1))}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10 text-xs font-mono cursor-pointer"
                    >
                      ZOOM -
                    </button>
                    <button
                      onClick={() => { setZoomScale(1); setIsZoomedOpen(false); }}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Image container */}
                  <div className="w-full h-full overflow-hidden flex items-center justify-center cursor-zoom-out" onClick={() => { setZoomScale(1); setIsZoomedOpen(false); }}>
                    <motion.img
                      src={mediaItems[currentIndex].src}
                      alt={garment.name}
                      animate={{ scale: zoomScale }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className={`max-w-full max-h-full object-contain rounded-lg ${mediaItems[currentIndex].flip ? 'scale-x-[-1]' : ''} ${mediaItems[currentIndex].filter || ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomScale(prev => prev === 1 ? 2 : 1);
                      }}
                      drag={zoomScale > 1}
                      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                      style={{ cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
                    />
                  </div>

                  {/* Helper text */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-mono tracking-wider uppercase pointer-events-none text-center bg-black/60 px-4 py-2 rounded-full border border-white/5">
                    Click to toggle zoom · Drag to pan when zoomed
                  </div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
