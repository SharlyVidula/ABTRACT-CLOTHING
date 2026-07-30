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
      <header className="relative z-30 w-full px-4 md:px-10 lg:px-16 py-4 md:py-6 border-b border-white/5 bg-black/20 backdrop-blur-md flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors cursor-pointer group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">BACK TO STUDIO</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <img src="/logo.png" alt="Abstract Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-xl md:rounded-2xl border border-white/15 shadow-[0_0_20px_rgba(var(--theme-glow-rgb),0.15)]" />
          <div className="flex flex-col text-left">
            <span className="font-sans text-xl md:text-2xl font-black tracking-[0.2em] text-[var(--theme-primary)] theme-glow-text">
              ABSTRACT
            </span>
            <span className="font-mono text-[7px] md:text-[8px] text-white/40 tracking-widest uppercase">
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
              ABSTRACT is proudly 100% Sri Lankan owned, designed, and operated. From our initial sketchpads to the finished garments on your hangers, every step of our process takes place right here in Sri Lanka.
            </p>
            <p>
              We exclusively use 100% pure Sri Lankan cotton fabrics sourced directly from local textile growers and mills. Naturally breathable and tailored specifically for Sri Lanka&apos;s tropical climate, our cotton delivers luxury feel, exceptional durability, and effortless everyday comfort.
            </p>
            <p className="text-white/90 font-medium pl-6 border-l-2 border-[var(--theme-primary)] py-2">
              &quot;100% Made in Sri Lanka — From Locally Sourced Sri Lankan Cotton to Master Tailoring.&quot;
            </p>
            <p>
              In our local atelier, skilled Sri Lankan artisans and master tailors hand-craft each garment with meticulous precision. By keeping our supply chain 100% local, ABSTRACT supports local communities, empowers island talent, and ensures unmatched quality control in every single stitch.
            </p>
            <p>
              Today, ABSTRACT stands as a symbol of modern Sri Lankan excellence. We fuse contemporary global style with authentic local craftsmanship, delivering premium couture engineered for the forward-thinking Sri Lankan consumer.
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
