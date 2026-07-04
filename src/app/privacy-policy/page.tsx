'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundScene from '@/components/BackgroundScene';
import { useStore } from '@/context/StoreContext';

export default function PrivacyPolicyPage() {
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
              PRIVACY SHIELD
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
            <FileText className="w-4 h-4 text-[var(--theme-primary)]" />
            <span className="font-mono text-[10px] tracking-widest text-[var(--theme-primary)] uppercase font-semibold">
              DATA TELEMETRY CHARTER
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            PRIVACY & DATA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-white/50">
              PROTECTION POLICY
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
              At <strong>ABSTRACT</strong>, we are committed to protecting the privacy and security of our customers&apos; personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit or make a purchase on our boutique platform. By using our website, you consent to the practices described in this policy.
            </p>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">1. Information We Collect</h3>
              <p>
                When you visit our website, we may collect certain information, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-white/60">
                <li>Personal identification information (such as your name, email address, shipping address, and phone number) provided voluntarily during checkout or user registration.</li>
                <li>Payment and billing information necessary to process your orders, which are securely handled by trusted third-party payment processors. We do not store your raw credit card numbers.</li>
                <li>Biometric telemetry inputs (height, chest, waist, hips, inseam) that you adjust in the Fit-On Studio. These inputs are used dynamically to compute clothing fit and are not shared with third parties.</li>
                <li>Browsing information, such as IP address, browser type, and device parameters collected automatically via cookies.</li>
              </ul>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">2. Use of Information</h3>
              <p>
                We use the collected data for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-white/60">
                <li>To process and fulfill your product orders, including shipping and courier dispatch.</li>
                <li>To communicate purchase updates, billing statements, and order verification status.</li>
                <li>To run simulated garment fittings and return automated sizing recommendations.</li>
                <li>To optimize our website aesthetics, product range, and overall digital catalog experience.</li>
                <li>To detect and prevent fraudulent transactions or security violations.</li>
              </ul>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">3. Information Sharing</h3>
              <p>
                We respect your privacy and do not sell, trade, or transfer your personal data to third parties. Exceptions are limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-white/60">
                <li><strong>Trusted Service Providers:</strong> We share necessary details with payment processing nodes (such as Stripe / PayHere) and delivery partners to complete your checkout transactions.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by applicable laws, regulations, or court warrants.</li>
              </ul>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">4. Data Security</h3>
              <p>
                We implement industry-standard encryption and security measures to protect your data from unauthorized access, modification, or exposure. Please note that no transmission mode over the internet is completely bulletproof, and we cannot guarantee absolute cyber-security.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-2">
              <h3 className="font-mono text-xs tracking-wider text-white font-bold uppercase">5. Cookies & Tracking</h3>
              <p>
                We utilize cookies to maintain your shopping cart state, session credentials, and user preferences. You may disable cookies in your web browser parameters, though this may limit core interactive checkout functions.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[10px] text-white font-bold uppercase">Data Protection Officer</h4>
                  <p className="text-xs text-white/50 font-mono">
                    For inquiries regarding data collection, contact: <a href="mailto:abstract.ltd.info@gmail.com" className="text-[var(--theme-primary)] hover:underline">abstract.ltd.info@gmail.com</a>
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
