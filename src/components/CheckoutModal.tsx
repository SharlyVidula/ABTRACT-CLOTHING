'use client';

import React, { useState } from 'react';
import { Garment } from '@/lib/garments';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CreditCard, ShieldCheck, Coins, Database, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  garment: Garment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ garment, isOpen, onClose }: CheckoutModalProps) {
  const { addToCart, setCartOpen, user } = useStore();
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cyber-Credits');

  if (!isOpen || !garment) return null;

  const handleConfirm = async () => {
    addToCart(garment, size, quantity, paymentMethod);
    onClose();
    
    // Open the cart slide drawer for immediate user response feedback
    setCartOpen(true);

    // Send the checkout email if user has an email
    if (user?.email) {
      try {
        await fetch('/api/checkout-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, username: user.username, gender: user.gender })
        });
      } catch (err) {
        console.error('Failed to send checkout email', err);
      }
    }
  };

  const paymentOptions = [
    { name: 'Cyber-Credits', icon: Coins, desc: 'Store digital credits' },
    { name: 'Credit Card', icon: CreditCard, desc: 'Visa/MC Secure Auth' },
    { name: 'Solana Network', icon: Database, desc: 'Web3 transaction matrix' },
    { name: 'Cash on Delivery', icon: Banknote, desc: 'Pay with cash upon package arrival' },
  ];

  const glowColor = garment.colorTheme.primary;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        
        {/* Modal container card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass rounded-[28px] overflow-hidden border border-white/10 shadow-2xl p-6 md:p-8 text-white"
        >
          {/* Header Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.01] focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Item description */}
          <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
            <span className="font-mono text-[9px] text-white/40 tracking-widest font-semibold uppercase">
              TRANSACTION PARAMETERS
            </span>
            <h3 className="text-xl font-bold tracking-tight uppercase" style={{ color: glowColor }}>
              {garment.name}
            </h3>
            <span className="font-mono text-sm font-semibold text-white/80 mt-1">
              ${garment.price * quantity} <span className="text-[10px] text-white/30 font-light">CREDITS</span>
            </span>
          </div>

          <div className="space-y-5 mt-5">
            {/* Size Selector */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-wider text-white/60">SIZE MATRIX</span>
              <div className="grid grid-cols-4 gap-2">
                {(['S', 'M', 'L', 'XL'] as const).map((sz) => {
                  const isSelected = size === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize(sz)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all duration-300 focus:outline-none cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                          : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white bg-white/[0.01]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-wider text-white/60">QUANTITY</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.01] flex items-center justify-center font-bold text-white transition-all focus:outline-none"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.01] flex items-center justify-center font-bold text-white transition-all focus:outline-none"
                >
                  +
                </button>
                <span className="text-[10px] text-white/30 font-mono self-center">MAXIMUM: 10 UNITS</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-wider text-white/60">PAYMENT ROUTE</span>
              <div className="space-y-2">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.name;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setPaymentMethod(opt.name)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all duration-300 text-left focus:outline-none cursor-pointer ${
                        isSelected
                          ? 'border-white bg-white/[0.04] shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                          : 'border-white/5 hover:border-white/10 text-white/60 hover:text-white bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-semibold">{opt.name}</span>
                          <span className="text-[9px] text-white/30">{opt.desc}</span>
                        </div>
                      </div>
                      <div 
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-white' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingestion CTA */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 mt-2 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <ShoppingBag className="w-4 h-4" />
              CONFIRM CART INGESTION
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-white/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TRANSACTIONS ROUTED THROUGH SECURE CORE PROTOCOL</span>
            </div>
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
