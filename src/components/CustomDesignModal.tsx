'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Send, CheckCircle2, AlertCircle, User, Phone, FileText, Layers, ImagePlus, XCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface CustomDesignInquiry {
  id: string;
  name: string;
  contact: string;
  garmentType: string;
  description: string;
  budget: string;
  colorPreference: string;
  referenceImage?: string; // base64 data URL
  referenceImageName?: string;
  submittedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-white/35 py-2.5 px-4 rounded-xl text-sm font-sans text-white transition-all outline-none placeholder-white/25';

const labelClass = 'text-[11px] font-mono font-semibold tracking-wider text-white/55 uppercase';

export default function CustomDesignModal({ isOpen, onClose }: Props) {
  const { trackEvent } = useStore();
  const [name, setName]                   = useState('');
  const [contact, setContact]             = useState('');
  const [garmentType, setGarmentType]     = useState('Frock');
  const [description, setDescription]    = useState('');
  const [budget, setBudget]               = useState('3000-6000');
  const [colorPreference, setColor]       = useState('');
  const [refImage, setRefImage]           = useState<string | null>(null);
  const [refImageName, setRefImageName]   = useState('');
  const [dragOver, setDragOver]           = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [error, setError]                 = useState('');
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setError('');
    setRefImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setRefImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !contact.trim() || !description.trim()) {
      setError('Please fill in Name, Contact, and Description.');
      return;
    }

    const inquiry: CustomDesignInquiry = {
      id: 'CDR_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name:            name.trim(),
      contact:         contact.trim(),
      garmentType,
      description:     description.trim(),
      budget,
      colorPreference: colorPreference.trim(),
      referenceImage:      refImage  ?? undefined,
      referenceImageName:  refImageName || undefined,
      submittedAt:     new Date().toLocaleString(),
    };

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', inquiry })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubmitted(true);
          trackEvent('custom_inquiry', { inquiryId: inquiry.id, garmentType: inquiry.garmentType, budget: inquiry.budget });
        } else {
          setError(data.error || 'Failed to submit design inquiry.');
        }
      })
      .catch(err => {
        setError('Network error occurred during submission.');
      });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName(''); setContact(''); setDescription('');
      setColor(''); setGarmentType('Frock'); setBudget('3000-6000');
      setRefImage(null); setRefImageName('');
      setSubmitted(false); setError('');
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />

          {/* Modal panel */}
          <motion.div
            className="relative w-full max-w-xl rounded-[28px] overflow-hidden border border-white/10 shadow-2xl z-10"
            style={{
              background: 'rgba(16,12,20,0.95)',
              backdropFilter: 'blur(32px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 32px 80px -16px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/8">
                  <Palette className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div>
                  <h2 className="font-sans text-base font-bold text-white tracking-tight">Custom Design Inquiry</h2>
                  <p className="font-mono text-[10px] text-white/40 tracking-wider">BESPOKE STUDIO REQUEST</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg border border-white/8 text-white/40 hover:text-white hover:border-white/20 transition-all focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-5 max-h-[72vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── Success State ────────────────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center gap-4 py-10"
                  >
                    <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-500/8 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Inquiry Submitted!</h3>
                      <p className="text-sm text-white/50 mt-2 max-w-xs leading-relaxed">
                        Our design studio team will review your request and reach out to you within 1–2 business days.
                      </p>
                    </div>
                    <p className="font-mono text-[10px] text-white/30 tracking-wider border border-white/8 px-3 py-1.5 rounded-lg">
                      ABSTRACT BESPOKE STUDIO · {new Date().toLocaleDateString()}
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all cursor-pointer"
                    >
                      Back to Store
                    </button>
                  </motion.div>
                ) : (
                  /* ── Inquiry Form ─────────────────────────────────────── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <p className="text-xs text-white/45 font-sans leading-relaxed border-l-2 border-[var(--theme-primary)]/40 pl-3">
                      Want something uniquely yours? Describe your ideal garment and our studio artisans will craft a bespoke quote for you.
                    </p>

                    {/* Row: Name + Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}><User className="w-3 h-3 inline mr-1 opacity-60" />Full Name</label>
                        <input
                          type="text" required placeholder="Your name"
                          value={name} onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}><Phone className="w-3 h-3 inline mr-1 opacity-60" />Contact</label>
                        <input
                          type="text" required placeholder="Email or phone"
                          value={contact} onChange={(e) => setContact(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Row: Garment Type + Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}><Layers className="w-3 h-3 inline mr-1 opacity-60" />Garment Type</label>
                        <select
                          value={garmentType} onChange={(e) => setGarmentType(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          {['Frock', 'Blouse', 'Shirt', 'Pants / Trousers', 'Jacket / Blazer',
                            'Skirt', 'Jumpsuit', 'Oversized Tee', 'Shorts', 'Other'].map(g => (
                            <option key={g} value={g} className="bg-[#0d090b]">{g}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Budget Range (LKR)</label>
                        <select
                          value={budget} onChange={(e) => setBudget(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          {[
                            { v: 'under-3000',    l: 'Under 3,000' },
                            { v: '3000-6000',     l: '3,000 – 6,000' },
                            { v: '6000-10000',    l: '6,000 – 10,000' },
                            { v: '10000-20000',   l: '10,000 – 20,000' },
                            { v: 'above-20000',   l: 'Above 20,000' },
                          ].map(o => (
                            <option key={o.v} value={o.v} className="bg-[#0d090b]">{o.l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Color preference */}
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Colour Preference <span className="text-white/25 normal-case">(optional)</span></label>
                      <input
                        type="text" placeholder="e.g. Navy blue with gold accents, pastel pink…"
                        value={colorPreference} onChange={(e) => setColor(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* ── Reference Image Upload ──────────────────────────── */}
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        <ImagePlus className="w-3 h-3 inline mr-1 opacity-60" />
                        Reference Image <span className="text-white/25 normal-case">(optional)</span>
                      </label>

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {refImage ? (
                        /* ── Preview ─────────────────────────────────────── */
                        <div className="relative group/img rounded-2xl overflow-hidden border border-white/12 bg-black/30">
                          <img
                            src={refImage}
                            alt="Reference"
                            className="w-full max-h-48 object-contain"
                          />
                          {/* File name bar */}
                          <div className="flex items-center justify-between px-3 py-2 border-t border-white/8 bg-black/50">
                            <span className="font-mono text-[9px] text-white/45 truncate max-w-[75%]">{refImageName}</span>
                            <button
                              type="button"
                              onClick={() => { setRefImage(null); setRefImageName(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                              className="flex items-center gap-1 text-[9px] font-mono text-red-400/70 hover:text-red-400 transition-colors cursor-pointer focus:outline-none"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Drop zone ────────────────────────────────────── */
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          className={`w-full py-7 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${
                            dragOver
                              ? 'border-[var(--theme-primary)] bg-[rgba(var(--theme-glow-rgb),0.08)] scale-[1.01]'
                              : 'border-white/12 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          <ImagePlus className={`w-6 h-6 transition-colors ${
                            dragOver ? 'text-[var(--theme-primary)]' : 'text-white/25'
                          }`} />
                          <div className="text-center">
                            <p className={`text-xs font-semibold transition-colors ${
                              dragOver ? 'text-[var(--theme-primary)]' : 'text-white/45'
                            }`}>
                              {dragOver ? 'Drop image here' : 'Click or drag & drop a reference image'}
                            </p>
                            <p className="text-[10px] text-white/25 mt-0.5">JPG, PNG, WEBP, GIF · max 5 MB</p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}><FileText className="w-3 h-3 inline mr-1 opacity-60" />Design Description</label>
                      <textarea
                        required rows={4}
                        placeholder="Describe your dream garment — style, occasion, silhouette, fabric ideas, any references…"
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        className={`${inputClass} resize-none leading-relaxed`}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/6 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none mt-1"
                      style={{
                        background: 'var(--theme-primary)',
                        color: 'black',
                        boxShadow: '0 0 24px var(--theme-glow)',
                      }}
                    >
                      <Send className="w-4 h-4" /> Submit Inquiry
                    </button>

                    <p className="text-center text-[10px] text-white/25 font-mono">
                      ABSTRACT BESPOKE STUDIO · Responses within 1–2 business days
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
