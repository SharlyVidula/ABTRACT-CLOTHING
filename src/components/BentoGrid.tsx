'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto p-4 ${className}`}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: 'col-span-1' | 'col-span-2' | 'col-span-3' | 'md:col-span-2' | 'md:col-span-3';
  glowColor?: string;
}

export function BentoCard({
  children,
  className = '',
  span = 'col-span-1',
  glowColor = 'rgba(139, 92, 246, 0.15)',
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      style={{
        boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px 0 ${glowColor}`,
      }}
      className={`glass relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 ${span} ${className}`}
    >
      {/* Grid line grid overlay background */}
      <div className="absolute inset-0 grid-cyber opacity-20 pointer-events-none" />
      
      {/* Decorative scanline sweep */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.015)] to-transparent -translate-y-full group-hover:translate-y-full transition-all duration-[1.5s] ease-in-out pointer-events-none" />

      {/* Decorative Corner Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-25 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: glowColor.includes('rgba') ? glowColor.split(',')[0].replace('rgba(', '') : glowColor }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
