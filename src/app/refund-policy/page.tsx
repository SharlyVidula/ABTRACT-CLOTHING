'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundScene from '@/components/BackgroundScene';
import { useStore } from '@/context/StoreContext';

export default function RefundPolicyPage() {
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
              REFUND DECREE
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
              TRANSACTION PARAMETER POLICIES
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            REFUND & RETURN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-white/50">
              POLICY MATRIX
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
              Thank you for shopping at <strong>ABSTRACT</strong>. We value your satisfaction and strive to provide you with the best online shopping experience possible. If, for any reason, you are not completely satisfied with your purchase, we are here to help.
            </p>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">1. Returns</h3>
              <p>
                We accept returns within <strong>14 days</strong> from the date of purchase. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also remain in the original packaging with all design tags attached.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">2. Refunds</h3>
              <p>
                Once we receive your return shipment and inspect the item, we will notify you of the approval or rejection status of your refund. If your return is approved, we will initiate a refund transaction back to your original method of payment. Please note that the refunded amount excludes any initial shipping charges.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">3. Exchanges</h3>
              <p>
                If you would like to exchange your item for a different size, color, or style, please contact our support team within <strong>14 days</strong> of receiving your order. We will provide you with further telemetry instructions on how to process the exchange.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">4. Non-Returnable Items</h3>
              <p>
                Certain items are non-returnable and non-refundable, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-white/60">
                <li>Gift cards and loyalty codes</li>
                <li>Digital downloads or promotional software items</li>
                <li>Personalized, bespoke, or custom-made items (including garments simulated/custom-tailored in the Bespoke Studio)</li>
              </ul>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">5. Damaged or Defective Items</h3>
              <p>
                In the unfortunate event that your item arrives damaged or defective, please contact us immediately. We will coordinate a courier replacement or issue a full refund, depending on product availability.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">6. Return Shipping</h3>
              <p>
                You will be responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g. wrong item shipped, defective product). In such cases, we will provide a prepaid shipping label.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">7. Processing Time</h3>
              <p>
                Refunds and exchanges will be processed within <strong>7 business days</strong> after we receive your returned item. Please note that it may take additional time for the credit to appear in your account, depending on your bank or payment provider.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[10px] text-white font-bold uppercase">Customer Support</h4>
                  <p className="text-xs text-white/50 font-mono">
                    For questions regarding our refund policy, contact: <a href="mailto:abstract.ltd.info@gmail.com" className="text-[var(--theme-primary)] hover:underline">abstract.ltd.info@gmail.com</a>
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
