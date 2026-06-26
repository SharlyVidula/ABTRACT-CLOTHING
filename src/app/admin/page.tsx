'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Garment, GarmentSizeGuide } from '@/lib/garments';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Terminal, ShieldAlert, Cpu, Plus, ClipboardList, TrendingUp, UserCog, Eye, EyeOff, AlertCircle, CheckCircle2, Heart, Sparkles, Palette, Download, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { user, products, orders, addProduct, createAdminUser, registeredUsers, removeAdminUser, updateOrderStatus } = useStore();
  const router = useRouter();

  // Product form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Top' | 'Bottom' | 'Outerwear'>('Outerwear');
  const [price, setPrice] = useState(250);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [visualType, setVisualType] = useState<'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt'>('frock');
  const [primaryGlow, setPrimaryGlow] = useState('#d500f9');
  const [secondaryGlow, setSecondaryGlow] = useState('#00ffaa');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unisex'>('Female');
  const [imagePath, setImagePath] = useState('/aurelia_silk_frock.png');
  const [isSuccess, setIsSuccess] = useState(false);

  // Admin creation states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminGender, setAdminGender] = useState<'Male' | 'Female'>('Male');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Sizing inputs
  const [chestS, setChestS] = useState(90);
  const [chestM, setChestM] = useState(98);
  const [chestL, setChestL] = useState(106);
  const [chestXL, setChestXL] = useState(114);

  const [waistS, setWaistS] = useState(70);
  const [waistM, setWaistM] = useState(78);
  const [waistL, setWaistL] = useState(86);
  const [waistXL, setWaistXL] = useState(94);

  const [hipsS, setHipsS] = useState(90);
  const [hipsM, setHipsM] = useState(98);
  const [hipsL, setHipsL] = useState(106);
  const [hipsXL, setHipsXL] = useState(114);

  // Custom Inquiries
  const [customInquiries, setCustomInquiries] = useState<any[]>([]);

  React.useEffect(() => {
    const data = localStorage.getItem('abstract_custom_inquiries');
    if (data) {
      try {
        setCustomInquiries(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse inquiries', e);
      }
    }
  }, []);

  const updateInquiryStatus = (id: string, status: 'accepted' | 'declined') => {
    const updated = customInquiries.map(inq => 
      inq.id === id ? { ...inq, status } : inq
    );
    setCustomInquiries(updated);
    localStorage.setItem('abstract_custom_inquiries', JSON.stringify(updated));
  };

  const [processingInquiry, setProcessingInquiry] = useState<string | null>(null);
  const [declineReasonFor, setDeclineReasonFor] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Custom Orders States
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [declineReasonForOrder, setDeclineReasonForOrder] = useState<string | null>(null);
  const [declineOrderReasonText, setDeclineOrderReasonText] = useState('');

  const sendInquiryEmail = async (inquiry: any, status: 'accepted' | 'declined', reason?: string) => {
    try {
      const res = await fetch('/api/inquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inquiry.contact,
          username: inquiry.name,
          inquiryId: inquiry.id,
          status,
          reason
        })
      });
      return res.json();
    } catch (e) {
      return { success: false };
    }
  };

  const handleAcceptInquiry = async (inquiry: any) => {
    setProcessingInquiry(inquiry.id);
    const emailRes = await sendInquiryEmail(inquiry, 'accepted');
    if (emailRes.success || !inquiry.contact.includes('@')) {
      updateInquiryStatus(inquiry.id, 'accepted');
    } else {
      alert('Failed to send email: ' + (emailRes.error || 'Unknown error'));
    }
    setProcessingInquiry(null);
  };

  const handleDeclineInquiry = async (inquiry: any) => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining.');
      return;
    }
    setProcessingInquiry(inquiry.id);
    const emailRes = await sendInquiryEmail(inquiry, 'declined', declineReason);
    if (emailRes.success || !inquiry.contact.includes('@')) {
      updateInquiryStatus(inquiry.id, 'declined');
      setDeclineReasonFor(null);
      setDeclineReason('');
    } else {
      alert('Failed to send email: ' + (emailRes.error || 'Unknown error'));
    }
    setProcessingInquiry(null);
  };

  // Order Status Notification Handlers
  const sendOrderStatusEmail = async (order: any, action: 'accept' | 'decline', reason?: string) => {
    const targetEmail = order.email || 'guest@example.com';
    try {
      const res = await fetch('/api/order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          username: order.user,
          orderId: order.id,
          action,
          reason,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to send status email', e);
      return { success: false };
    }
  };

  const handleAcceptOrder = async (order: any) => {
    setProcessingOrder(order.id);
    const emailRes = await sendOrderStatusEmail(order, 'accept');
    if (emailRes.success || !order.email) {
      updateOrderStatus(order.id, 'Pending Delivery');
    } else {
      alert('Failed to send acceptance email: ' + (emailRes.error || 'Unknown error'));
    }
    setProcessingOrder(null);
  };

  const handleDeclineOrder = async (order: any) => {
    if (!declineOrderReasonText.trim()) {
      alert('Please provide a reason for declining.');
      return;
    }
    setProcessingOrder(order.id);
    const emailRes = await sendOrderStatusEmail(order, 'decline', declineOrderReasonText);
    if (emailRes.success || !order.email) {
      updateOrderStatus(order.id, 'Discarded', declineOrderReasonText);
      setDeclineReasonForOrder(null);
      setDeclineOrderReasonText('');
    } else {
      alert('Failed to send decline email: ' + (emailRes.error || 'Unknown error'));
    }
    setProcessingOrder(null);
  };

  const handleDispatchOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Dispatched');
  };

  const downloadPDF = (inquiry: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Inquiry_${inquiry.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #333; }
            h1 { color: #d500f9; }
            .details { margin-bottom: 20px; }
            .details p { margin: 5px 0; font-size: 14px; }
            img { max-width: 100%; max-height: 400px; margin-top: 20px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Custom Design Inquiry: ${inquiry.id}</h1>
          <div class="details">
            <p><strong>Client:</strong> ${inquiry.name}</p>
            <p><strong>Contact:</strong> ${inquiry.contact}</p>
            <p><strong>Budget:</strong> ${inquiry.budget}</p>
            <p><strong>Garment:</strong> ${inquiry.garmentType}</p>
            <p><strong>Color Pref:</strong> ${inquiry.colorPreference || 'N/A'}</p>
            <p><strong>Submitted:</strong> ${inquiry.submittedAt}</p>
            <p><strong>Description:</strong><br/>${inquiry.description}</p>
          </div>
          ${inquiry.referenceImage ? `<img src="${inquiry.referenceImage}" />` : ''}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Authorization Check
  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-cyber-dark relative flex items-center justify-center p-6">
        <div className="absolute inset-0 grid-drift-effect opacity-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass rounded-3xl p-8 border border-red-500/30 text-center flex flex-col items-center gap-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] text-white"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-mono text-xl font-bold tracking-widest text-red-400">
              UNAUTHORIZED ROUTE
            </h2>
            <p className="text-xs text-white/50 leading-relaxed font-mono">
              CREDENTIAL FAILURE: ROOT PRIVILEGES REQUIRED. ESTABLISH MATRIX LOGIN AS ADMIN ROLE FIRST.
            </p>
          </div>

          <div className="flex gap-4 w-full mt-2">
            <button
              onClick={() => router.push('/login')}
              className="flex-1 py-3 rounded-xl font-mono text-xs font-bold border border-cyber-purple/30 bg-cyber-purple/5 hover:bg-cyber-purple/10 text-cyber-purple transition-all"
            >
              IDENTITY LOGIN
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl font-mono text-xs font-bold border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.01]"
            >
              HOME GRID
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const sizes: GarmentSizeGuide = {
      S: { chest: chestS, waist: waistS, hips: hipsS, height: 170, inseam: category === 'Bottom' ? 76 : undefined },
      M: { chest: chestM, waist: waistM, hips: hipsM, height: 175, inseam: category === 'Bottom' ? 78 : undefined },
      L: { chest: chestL, waist: waistL, hips: hipsL, height: 180, inseam: category === 'Bottom' ? 80 : undefined },
      XL: { chest: chestXL, waist: waistXL, hips: hipsXL, height: 185, inseam: category === 'Bottom' ? 82 : undefined },
    };

    const newGarment: Garment = {
      id,
      name: name.toUpperCase(),
      category,
      price,
      description,
      technicalDetails: details.split(',').map((d) => d.trim()).filter(Boolean),
      sizes,
      inventory: { S: 10, M: 10, L: 10, XL: 10 },
      colorTheme: {
        primary: primaryGlow,
        secondary: secondaryGlow,
        glow: `${primaryGlow}40`,
        glowRgb: '213, 0, 249',
      },
      visualStyle: {
        type: visualType,
        primaryColor: '#12121e',
        accentColor: primaryGlow,
        glowingLines: true,
      },
      gender,
      image: imagePath,
    };

    addProduct(newGarment);
    setIsSuccess(true);
    
    // Reset Form
    setName('');
    setDescription('');
    setDetails('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-cyber-dark text-white relative flex flex-col justify-between">
      <div className="absolute inset-0 grid-drift-effect opacity-10 pointer-events-none" />

      {/* Admin Nav */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-6 border-b border-white/5 bg-cyber-dark/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2.5 rounded-full border border-white/10 text-white/50 hover:text-white transition-all bg-white/[0.02]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img src="/logo.png" alt="Abstract Logo" className="w-12 h-12 object-contain rounded-lg border border-cyber-purple/35 shadow-[0_0_20px_rgba(213,0,249,0.2)]" />
          <div>
            <h1 className="font-mono text-base font-bold tracking-widest text-cyber-purple text-glow-purple flex items-center gap-2">
              ADMIN CONTROL PANEL
            </h1>
            <span className="font-mono text-[8px] text-white/30 tracking-widest">
              OVERRIDE PERMISSIONS ACQUIRED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-white/40">
          <span>OPERATOR: {user.username}</span>
          <span className="text-cyber-purple font-bold uppercase bg-cyber-purple/5 border border-cyber-purple/20 px-2 py-0.5 rounded">
            ROOT_NODE
          </span>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stat Blocks Header row (Spans all columns) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-white/40 tracking-wider">TOTAL METADATA VAL</span>
              <div className="font-mono text-2xl font-bold text-cyber-purple text-glow-purple">${revenue}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-cyber-purple opacity-30" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-purple opacity-50" />
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-white/40 tracking-wider">ACTIVE INVENTORY</span>
              <div className="font-mono text-2xl font-bold text-cyber-green text-glow-green">{products.length} Units</div>
            </div>
            <Cpu className="w-8 h-8 text-cyber-green opacity-30" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-green opacity-50" />
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-white/40 tracking-wider">COMPLETED TRANSACTIONS</span>
              <div className="font-mono text-2xl font-bold text-cyber-blue">{orders.length} Trans</div>
            </div>
            <ClipboardList className="w-8 h-8 text-cyber-blue opacity-30" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-blue opacity-50" />
          </div>

        </div>

        {/* Left Form: Inventory Calibrator (Takes 2 cols on lg) */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Plus className="w-5 h-5 text-cyber-green" />
            <div>
              <h3 className="font-mono text-sm tracking-widest text-cyber-green font-semibold">
                CATALOG MATRIX INJECTOR
              </h3>
              <p className="text-xs text-white/40">Append custom garments (frocks, skirts, jackets) to store matrix</p>
            </div>
          </div>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border border-cyber-green/30 bg-cyber-green/5 text-center font-mono text-xs text-cyber-green font-bold tracking-wider"
            >
              [+] INVENTORY TELEMETRY SUCCESSFULLY MOUNTED
            </motion.div>
          )}

          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left form params */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">PRODUCT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neo Pleated Skirt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-white/50 tracking-wider">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'Outerwear' | 'Top' | 'Bottom')}
                    className="bg-cyber-dark border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-white/50 tracking-wider">PRICE (CREDITS)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">DESCRIPTION</label>
                <textarea
                  required
                  placeholder="Summarize visual layout..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">TECHNICAL SPECS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Waterproof shell, glowing pleats, etc."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 tracking-wider">DRAW SHAPE</label>
                  <select
                    value={visualType}
                    onChange={(e) => setVisualType(e.target.value as 'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt')}
                    className="bg-cyber-dark border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-2 rounded-xl text-[10px] font-mono text-white outline-none"
                  >
                    <option value="blazer">Blazer</option>
                    <option value="parka">Parka</option>
                    <option value="trousers">Trousers</option>
                    <option value="frock">Frock</option>
                    <option value="skirt">Skirt</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 tracking-wider">PRIMARY GLOW</label>
                  <input
                    type="color"
                    value={primaryGlow}
                    onChange={(e) => setPrimaryGlow(e.target.value)}
                    className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 tracking-wider">SECONDARY</label>
                  <input
                    type="color"
                    value={secondaryGlow}
                    onChange={(e) => setSecondaryGlow(e.target.value)}
                    className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              {/* Gender and Image Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 tracking-wider">GENDER TARGET</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Unisex')}
                    className="bg-cyber-dark border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 tracking-wider">IMAGE PATH</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /aurelia_silk_frock.png"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Form: Sizing configurations */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                <span className="font-mono text-[10px] text-white/40 tracking-wider block border-b border-white/5 pb-1">
                  TECHNICAL BODY GUIDE (Chest / Waist / Hips in cm)
                </span>

                {/* Sizing Guides Grid */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <span className="font-mono text-[9px] text-white/30 self-center">SIZE</span>
                  <span className="font-mono text-[9px] text-white/50">CHEST</span>
                  <span className="font-mono text-[9px] text-white/50">WAIST</span>
                  <span className="font-mono text-[9px] text-white/50">HIPS</span>

                  {/* Size S */}
                  <span className="font-mono text-xs text-cyber-purple self-center font-bold">S</span>
                  <input
                    type="number"
                    value={chestS}
                    onChange={(e) => setChestS(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={waistS}
                    onChange={(e) => setWaistS(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={hipsS}
                    onChange={(e) => setHipsS(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />

                  {/* Size M */}
                  <span className="font-mono text-xs text-cyber-purple self-center font-bold">M</span>
                  <input
                    type="number"
                    value={chestM}
                    onChange={(e) => setChestM(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={waistM}
                    onChange={(e) => setWaistM(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={hipsM}
                    onChange={(e) => setHipsM(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />

                  {/* Size L */}
                  <span className="font-mono text-xs text-cyber-purple self-center font-bold">L</span>
                  <input
                    type="number"
                    value={chestL}
                    onChange={(e) => setChestL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={waistL}
                    onChange={(e) => setWaistL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={hipsL}
                    onChange={(e) => setHipsL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />

                  {/* Size XL */}
                  <span className="font-mono text-xs text-cyber-purple self-center font-bold">XL</span>
                  <input
                    type="number"
                    value={chestXL}
                    onChange={(e) => setChestXL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={waistXL}
                    onChange={(e) => setWaistXL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    value={hipsXL}
                    onChange={(e) => setHipsXL(parseInt(e.target.value))}
                    className="bg-white/[0.01] border border-white/5 py-1 px-1 rounded font-mono text-xs text-center text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-mono text-xs tracking-wider font-semibold bg-cyber-green text-black hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                MOUNT GARMENT MODULE
              </button>
            </div>

          </form>
        </div>

        {/* Right Form: Transaction log stream (1 col) */}
        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4 overflow-hidden h-[62vh] lg:h-[72vh]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <ClipboardList className="w-4 h-4 text-cyber-purple" />
            <div>
              <h3 className="font-mono text-xs tracking-widest text-cyber-purple font-semibold">
                TRANSACTION DATABASE
              </h3>
              <p className="text-[10px] text-white/30">Order receipts log telemetry stream</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {orders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/20 py-12">
                <Terminal className="w-8 h-8 mb-2 animate-pulse" />
                <span className="font-mono text-[10px] tracking-wider">SYS_LOG: EMPTY</span>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-white/80">
                    <span className="text-cyber-green font-bold">{order.id}</span>
                    <span className="text-white/30">{order.date}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span className="text-white/40">STATUS:</span>
                    {(!order.status || order.status === 'Pending Approval') && (
                      <span className="text-[8px] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded bg-amber-500/10">PENDING APPROVAL</span>
                    )}
                    {order.status === 'Pending Delivery' && (
                      <span className="text-[8px] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-500/10">PENDING DELIVERY</span>
                    )}
                    {order.status === 'Dispatched' && (
                      <span className="text-[8px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">DISPATCHED</span>
                    )}
                    {order.status === 'Discarded' && (
                      <span className="text-[8px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/10">DISCARDED</span>
                    )}
                  </div>
                  
                  <div className="text-white/40 flex justify-between">
                    <span>CUSTOMER:</span>
                    <span className="text-white/60">{order.user}</span>
                  </div>
                  {order.email && (
                    <div className="text-white/40 flex justify-between">
                      <span>EMAIL:</span>
                      <span className="text-white/50 truncate max-w-[130px]">{order.email}</span>
                    </div>
                  )}

                  <div className="space-y-1 my-1 border-y border-white/5 py-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-white/60">
                        <span className="truncate max-w-[130px]">{item.garment.name}</span>
                        <span>{item.size} &times; {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-white/80 font-bold">
                    <span>TOTAL CREDITS:</span>
                    <span className="text-cyber-purple text-glow-purple">${order.total}</span>
                  </div>
                  <div className="text-[8px] text-white/20 flex justify-between">
                    <span>METHOD:</span>
                    <span>{order.paymentMethod.toUpperCase()}</span>
                  </div>

                  {/* Order Workflow Action Buttons */}
                  {(!order.status || order.status === 'Pending Approval') && declineReasonForOrder !== order.id && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleAcceptOrder(order)}
                        disabled={processingOrder === order.id}
                        className="flex-1 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {processingOrder === order.id ? 'ACCEPTING...' : 'ACCEPT'}
                      </button>
                      <button
                        onClick={() => { setDeclineReasonForOrder(order.id); setDeclineOrderReasonText(''); }}
                        disabled={processingOrder === order.id}
                        className="flex-1 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-[9px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        DISCARD
                      </button>
                    </div>
                  )}

                  {declineReasonForOrder === order.id && (
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                      <textarea
                        value={declineOrderReasonText}
                        onChange={(e) => setDeclineOrderReasonText(e.target.value)}
                        placeholder="Reason for discarding order..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] font-sans text-white resize-none outline-none focus:border-red-500/50"
                        rows={2}
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setDeclineReasonForOrder(null)}
                          disabled={processingOrder === order.id}
                          className="flex-1 py-1 rounded-lg border border-white/10 text-white/50 hover:text-white bg-white/[0.02] text-[9px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleDeclineOrder(order)}
                          disabled={processingOrder === order.id}
                          className="flex-1 py-1 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-[9px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {processingOrder === order.id ? 'SENDING...' : 'CONFIRM'}
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'Pending Delivery' && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDispatchOrder(order.id)}
                        className="w-full py-1.5 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 hover:bg-cyber-purple/35 text-cyber-purple text-[9px] font-bold transition-colors cursor-pointer"
                      >
                        DISPATCH TO COURIER
                      </button>
                    </div>
                  )}

                  {order.status === 'Dispatched' && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-center text-emerald-400 font-bold text-[8px]">
                      [+] DISPATCHED TO COURIER TEAM
                    </div>
                  )}

                  {order.status === 'Discarded' && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-red-400 text-[8px] flex flex-col gap-0.5">
                      <span className="font-bold">[-] ORDER DISCARDED</span>
                      {order.declineReason && (
                        <span className="text-white/40 leading-normal italic">Reason: {order.declineReason}</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Custom Design Requests */}
        <div className="lg:col-span-3 glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4 mb-6">
            <Palette className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-mono text-sm tracking-widest text-amber-500 font-semibold">CUSTOM DESIGN INQUIRIES</h3>
              <p className="text-xs text-white/40">Bespoke studio requests from customers</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customInquiries.filter(inquiry => !inquiry.status).length === 0 ? (
              <div className="col-span-full py-10 flex flex-col items-center justify-center text-white/20">
                <span className="font-mono text-xs tracking-wider">NO ACTIVE INQUIRIES</span>
              </div>
            ) : (
              customInquiries.filter(inquiry => !inquiry.status).map((inquiry, i) => (
                <div key={inquiry.id || i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-3 font-mono text-xs relative group">
                  <div className="flex justify-between items-start border-b border-white/5 pb-2">
                    <span className="text-amber-500 font-bold">{inquiry.id}</span>
                    <div className="flex items-center gap-2">
                      {inquiry.status === 'accepted' && <span className="text-[9px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">ACCEPTED</span>}
                      {inquiry.status === 'declined' && <span className="text-[9px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/10">DECLINED</span>}
                      {!inquiry.status && <span className="text-[9px] text-white/30">{inquiry.submittedAt}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-white/60">CLIENT: <span className="text-white">{inquiry.name}</span></span>
                    <span className="text-white/60">CONTACT: <span className="text-white">{inquiry.contact}</span></span>
                    <span className="text-white/60">BUDGET: <span className="text-white">{inquiry.budget}</span></span>
                  </div>
                  
                  <div className="text-white/40 mt-1">
                    <span className="text-[10px] text-white/50 block mb-1">GARMENT: {inquiry.garmentType}</span>
                    <p className="text-[10px] leading-relaxed break-words whitespace-pre-wrap">{inquiry.description}</p>
                    {inquiry.colorPreference && (
                      <p className="text-[10px] mt-1 break-words"><span className="text-white/50">COLOR:</span> {inquiry.colorPreference}</p>
                    )}
                  </div>
                  
                  {inquiry.referenceImage && (
                    <div className="mt-2 pt-3 border-t border-white/5 relative group/img overflow-hidden rounded-lg">
                      <span className="text-[9px] text-white/40 block mb-2 z-10 relative">REFERENCE IMAGE</span>
                      <img src={inquiry.referenceImage} alt="Ref" className="w-full h-32 object-cover bg-black/40 border border-white/10 transition-transform duration-300 group-hover/img:scale-105" />
                      <div className="absolute inset-0 top-6 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                        <button
                          onClick={() => downloadPDF(inquiry)}
                          className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold hover:scale-105 transition-transform cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      </div>
                    </div>
                  )}

                  {!inquiry.status && declineReasonFor !== inquiry.id && (
                    <div className="flex gap-2 mt-2 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleAcceptInquiry(inquiry)}
                        disabled={processingInquiry === inquiry.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> {processingInquiry === inquiry.id ? 'SENDING...' : 'ACCEPT'}
                      </button>
                      <button
                        onClick={() => { setDeclineReasonFor(inquiry.id); setDeclineReason(''); }}
                        disabled={processingInquiry === inquiry.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3 h-3" /> DECLINE
                      </button>
                    </div>
                  )}

                  {!inquiry.status && declineReasonFor === inquiry.id && (
                    <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
                      <textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Reason for declining..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-sans text-white resize-none outline-none focus:border-red-500/50"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeclineReasonFor(null)}
                          disabled={processingInquiry === inquiry.id}
                          className="flex-1 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white bg-white/[0.02] text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleDeclineInquiry(inquiry)}
                          disabled={processingInquiry === inquiry.id}
                          className="flex-1 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {processingInquiry === inquiry.id ? 'SENDING...' : 'CONFIRM DECLINE'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Team Management */}
        <div className="lg:col-span-3 glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4 mb-6">
            <UserCog className="w-5 h-5 text-cyber-purple" />
            <div>
              <h3 className="font-mono text-sm tracking-widest text-cyber-purple font-semibold">ADMIN TEAM MANAGEMENT</h3>
              <p className="text-xs text-white/40">Create new administrator accounts — only accessible to existing admins</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Admin Form */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs text-white/60 tracking-wider">CREATE NEW ADMIN</h4>

              {adminSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {adminSuccess}
                </motion.div>
              )}
              {adminError && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {adminError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">USERNAME</label>
                <input
                  type="text"
                  placeholder="e.g. manager_lisa"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-purple py-2.5 px-4 rounded-xl text-sm font-sans text-white transition-all outline-none placeholder-white/25"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showAdminPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-purple py-2.5 px-4 pr-11 rounded-xl text-sm font-sans text-white transition-all outline-none placeholder-white/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                  >
                    {showAdminPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-white/50 tracking-wider">GENDER</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminGender('Female')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none ${
                      adminGender === 'Female'
                        ? 'border-rose-400 text-rose-300 bg-rose-500/8'
                        : 'border-white/10 text-white/50 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current opacity-80" /> Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminGender('Male')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none ${
                      adminGender === 'Male'
                        ? 'border-amber-500 text-amber-300 bg-amber-500/8'
                        : 'border-white/10 text-white/50 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Male
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setAdminError('');
                  setAdminSuccess('');
                  const result = await createAdminUser(adminUsername, adminPassword, adminGender);
                  if (result.success) {
                    setAdminSuccess(`Admin account "${adminUsername.trim()}" created successfully.`);
                    setAdminUsername('');
                    setAdminPassword('');
                  } else {
                    setAdminError(result.error || 'Failed to create admin.');
                  }
                }}
                className="w-full py-3 rounded-xl font-mono text-xs tracking-wider font-semibold bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCog className="w-4 h-4" />
                CREATE ADMIN ACCOUNT
              </button>
            </div>

            {/* Current Admins List */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs text-white/60 tracking-wider">CURRENT ADMIN ACCOUNTS</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {registeredUsers.filter((u) => u.role === 'Admin').map((u) => (
                  <div
                    key={u.username}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center">
                        <span className="text-cyber-purple text-[10px] font-bold">{u.username[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white/90 font-semibold">{u.username}</p>
                        <p className="text-white/40 text-[10px]">{u.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.username === user?.username && (
                        <span className="text-[10px] text-cyber-green border border-cyber-green/20 px-2 py-0.5 rounded bg-cyber-green/5">YOU</span>
                      )}
                      {u.username !== 'admin' && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to remove ${u.username}?`)) {
                              setAdminError('');
                              setAdminSuccess('');
                              const res = await removeAdminUser(u.username);
                              if (res.success) {
                                setAdminSuccess(`Admin account "${u.username}" removed.`);
                              } else {
                                setAdminError(res.error || 'Failed to remove admin.');
                              }
                            }
                          }}
                          className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer font-bold"
                        >
                          REMOVE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-30 border-t border-white/5 bg-cyber-dark/80 backdrop-blur-md py-6 px-6 text-center text-white/30 text-[9px] font-mono">
        <span>&copy; 2026 AETHER OVERRIDE CORE LOGS. AUTHORIZED ADMINISTRATOR ONLY.</span>
      </footer>

    </div>
  );
}
