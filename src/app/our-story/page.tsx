'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundScene from '@/components/BackgroundScene';
import { useStore } from '@/context/StoreContext';

export default function OurStoryPage() {
  const { genderMode } = useStore();

  return (
    <div className={`min-h-screen relative flex flex-col font-sans text-white select-none transition-all duration-500 bg-[var(--theme-bg)] ${genderMode === 'Female' ? 'theme-female' : 'theme-male'}`}>
      
      {/* Background scene for consistency */}
      <BackgroundScene mode={genderMode} />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[rgba(var(--theme-glow-rgb),0.08)] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[rgba(var(--theme-glow-rgb),0.08)] blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-30 w-full px-6 md:px-10 lg:px-16 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors cursor-pointer group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">BACK TO STUDIO</span>
        </Link>
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Abstract Logo" className="w-14 h-14 object-contain rounded-2xl border border-white/15 shadow-[0_0_20px_rgba(var(--theme-glow-rgb),0.15)]" />
          <div className="flex flex-col text-left">
            <span className="font-sans text-2xl font-black tracking-[0.2em] text-[var(--theme-primary)] theme-glow-text">
              ABSTRACT
            </span>
            <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">
              OUR STORY
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col gap-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 flex flex-col items-center"
        >
          <img src="/logo.png" alt="Abstract Logo" className="w-32 h-32 object-contain rounded-[28px] border border-white/10 shadow-[0_0_40px_rgba(var(--theme-glow-rgb),0.25)] mb-2 hover:rotate-6 transition-transform duration-500" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] w-fit">
            <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
            <span className="font-mono text-[10px] tracking-widest text-[var(--theme-primary)] uppercase font-semibold">
              The Genesis
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            FORGING THE FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-white/50">
              OF COUTURE
            </span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/5 space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-5">
            <Hexagon className="w-64 h-64" />
          </div>

          <div className="space-y-6 text-white/70 leading-relaxed font-light text-lg relative z-10">
            <p>
              It began with a simple question: What if clothing wasn&apos;t just worn, but engineered? ABSTRACT was born out of a desire to bridge the gap between high-fashion aesthetics and futuristic utility.
            </p>
            <p>
              In a small, dimly lit studio in the heart of the metropolis, a collective of avant-garde designers and material scientists came together. They saw a world saturated with fast fashion and disposable trends, and they decided to rewrite the code.
            </p>
            <p className="text-white/90 font-medium pl-6 border-l-2 border-[var(--theme-primary)] py-2">
              &quot;We don&apos;t design clothes. We engineer armor for the modern landscape.&quot;
            </p>
            <p>
              Every garment in the ABSTRACT catalogue is a testament to this philosophy. From our signature heavy wool parkas to the drop-shoulder street cuts, each piece is meticulously crafted using advanced biometric telemetry data to ensure perfect clearances and unparalleled comfort.
            </p>
            <p>
              Today, ABSTRACT isn&apos;t just a brand; it&apos;s a movement. A community of forward-thinkers, creators, and visionaries who demand more from their attire. We are constantly pushing the boundaries of what is possible, merging the digital and physical realms to create truly transcendent pieces.
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
