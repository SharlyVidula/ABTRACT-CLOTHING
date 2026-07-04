'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundScene from '@/components/BackgroundScene';
import { useStore } from '@/context/StoreContext';

export default function TermsConditionsPage() {
  const { genderMode } = useStore();

  return (
    <div className={`min-h-screen relative flex flex-col font-sans text-white select-none transition-all duration-500 bg-[var(--theme-bg)] ${genderMode === 'Female' ? 'theme-female' : 'theme-male'}`}>
      
      {/* Background scene */}
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
              TERMS & CONDITIONS
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col gap-12 animate-fade-in">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] w-fit">
            <FileCheck className="w-4 h-4 text-[var(--theme-primary)]" />
            <span className="font-mono text-[10px] tracking-widest text-[var(--theme-primary)] uppercase font-semibold">
              PLATFORM CORE RULES
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            TERMS & SERVICE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-white/50">
              AGREEMENT
            </span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/5 space-y-8 relative overflow-hidden"
        >
          <div className="space-y-6 text-white/70 leading-relaxed font-light text-sm md:text-base relative z-10 font-sans">
            <p>
              Welcome to <strong>ABSTRACT</strong>. These Terms and Conditions govern your use of our e-commerce platform and purchase agreements. By accessing and using our website, you agree to comply with these terms. Please read them carefully before conducting transactions.
            </p>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">1. Use of the Website</h3>
              <p>
                a. You must be at least <strong>18 years old</strong> to make purchases on our platform.
              </p>
              <p>
                b. You are responsible for safeguarding your account details, including usernames and access keys.
              </p>
              <p>
                c. You agree to provide accurate and active billing and shipping details during checkout.
              </p>
              <p>
                d. You may not use our platform for any unlawful, unauthorized, or fraudulent activities.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">2. Product Specifications & Pricing</h3>
              <p>
                a. We endeavor to display correct descriptions, imagery, dimensions, and prices. However, we do not warrant that all specifications are entirely error-free.
              </p>
              <p>
                b. Listed prices are subject to change without prior notice. Seasonal campaigns, brand collabs, or active discounts are valid only for a limited timeframe.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">3. Orders & Payment Routing</h3>
              <p>
                a. Submitting a checkout request represents a formal offer to purchase the specified items.
              </p>
              <p>
                b. We reserve the right to cancel or reject orders due to inventory shortfalls, pricing anomalies, or suspected security risks.
              </p>
              <p>
                c. You authorize us to charge your selected payment method (Credit Card, Solana wallet, or store credits) for the total order amount.
              </p>
              <p>
                d. Payments are handled securely via third-party aggregators. We do not store or process your full card numbers.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">4. Shipping & Delivery</h3>
              <p>
                a. We make every effort to ship packages swiftly. Shipping estimates are provided as guides and may vary depending on local carrier pipelines or weather conditions.
              </p>
              <p>
                b. Ownership and risk of loss transfer to you upon hand-off of the package to our designated courier team.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">5. Returns & Refunds</h3>
              <p>
                All returns, refunds, and size exchanges are governed strictly by our <Link href="/refund-policy" className="text-[var(--theme-primary)] hover:underline">Refund Policy</Link>. Review its guidelines before placing an order.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">6. Intellectual Property</h3>
              <p>
                All digital assets displayed on this site—including catalog designs, brand logos, code elements, text content, and visual studio assets—remain the exclusive intellectual property of <strong>ABSTRACT</strong>. Unauthorized copying, distribution, or modifications are strictly prohibited.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">7. Limitation of Liability</h3>
              <p>
                Under no circumstances shall <strong>ABSTRACT</strong>, its directors, or affiliates be liable for any direct, indirect, or incidental damages resulting from your use of this platform or garments purchased from us.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <Landmark className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[10px] text-white font-bold uppercase">Legal & Compliance</h4>
                  <p className="text-xs text-white/50 font-mono">
                    For legal questions regarding terms of service, contact: <a href="mailto:abstract.ltd.info@gmail.com" className="text-[var(--theme-primary)] hover:underline">abstract.ltd.info@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
