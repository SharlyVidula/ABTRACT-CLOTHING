'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Garment, GarmentSizeGuide } from '@/lib/garments';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Terminal, ShieldAlert, Cpu, Plus, ClipboardList, 
  TrendingUp, UserCog, Eye, EyeOff, AlertCircle, CheckCircle2, 
  Heart, Sparkles, Palette, Download, Check, X, Search, 
  SlidersHorizontal, Trash2, Edit3, AlertTriangle, Coins, 
  Package, BarChart3, ChevronRight, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { 
    user, products, orders, addProduct, updateProduct, deleteProduct,
    createAdminUser, registeredUsers, removeAdminUser, updateOrderStatus 
  } = useStore();
  const router = useRouter();

  // Active dashboard tab state
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'inventory' | 'injector' | 'orders' | 'inquiries' | 'security'>('diagnostics');

  // Inventory filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Top' | 'Bottom' | 'Outerwear'>('All');
  const [filterGender, setFilterGender] = useState<'All' | 'Male' | 'Female' | 'Unisex'>('All');
  const [showLowStock, setShowLowStock] = useState(false);

  // Edit Garment State
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<'Top' | 'Bottom' | 'Outerwear'>('Outerwear');
  const [editPrice, setEditPrice] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editVisualType, setEditVisualType] = useState<'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt'>('frock');
  const [editPrimaryGlow, setEditPrimaryGlow] = useState('#d500f9');
  const [editSecondaryGlow, setEditSecondaryGlow] = useState('#00ffaa');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Unisex'>('Female');
  const [editImagePath, setEditImagePath] = useState('/aurelia_silk_frock.png');

  // Edit sizing states
  const [editChestS, setEditChestS] = useState(90);
  const [editChestM, setEditChestM] = useState(98);
  const [editChestL, setEditChestL] = useState(106);
  const [editChestXL, setEditChestXL] = useState(114);
  const [editWaistS, setEditWaistS] = useState(70);
  const [editWaistM, setEditWaistM] = useState(78);
  const [editWaistL, setEditWaistL] = useState(86);
  const [editWaistXL, setEditWaistXL] = useState(94);
  const [editHipsS, setEditHipsS] = useState(90);
  const [editHipsM, setEditHipsM] = useState(98);
  const [editHipsL, setEditHipsL] = useState(106);
  const [editHipsXL, setEditHipsXL] = useState(114);

  // Product creator states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Top' | 'Bottom' | 'Outerwear'>('Outerwear');
  const [price, setPrice] = useState(250);
  const [cost, setCost] = useState(180);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [visualType, setVisualType] = useState<'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt'>('frock');
  const [primaryGlow, setPrimaryGlow] = useState('#d500f9');
  const [secondaryGlow, setSecondaryGlow] = useState('#00ffaa');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unisex'>('Female');
  const [imagePath, setImagePath] = useState('/aurelia_silk_frock.png');
  const [isSuccess, setIsSuccess] = useState(false);

  // Creator sizing inputs
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

  // Admin creation states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminGender, setAdminGender] = useState<'Male' | 'Female'>('Male');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Custom Inquiries State
  const [customInquiries, setCustomInquiries] = useState<any[]>([]);
  const [processingInquiry, setProcessingInquiry] = useState<string | null>(null);
  const [declineReasonFor, setDeclineReasonFor] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Custom Orders States
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [declineReasonForOrder, setDeclineReasonForOrder] = useState<string | null>(null);
  const [declineOrderReasonText, setDeclineOrderReasonText] = useState('');

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

  // Sync Inquiries status helper
  const updateInquiryStatus = (id: string, status: 'accepted' | 'declined') => {
    const updated = customInquiries.map(inq => 
      inq.id === id ? { ...inq, status } : inq
    );
    setCustomInquiries(updated);
    localStorage.setItem('abstract_custom_inquiries', JSON.stringify(updated));
  };

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

  // Create Product Handler
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
      cost,
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
    setCost(180);
    setPrice(250);
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  // Edit Product Trigger
  const handleOpenEditModal = (p: Garment) => {
    setEditingGarment(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditPrice(p.price);
    setEditCost(p.cost !== undefined ? p.cost : Math.round(p.price * 0.7));
    setEditDescription(p.description);
    setEditDetails(p.technicalDetails.join(', '));
    setEditVisualType(p.visualStyle.type);
    setEditPrimaryGlow(p.colorTheme.primary);
    setEditSecondaryGlow(p.colorTheme.secondary);
    setEditGender(p.gender);
    setEditImagePath(p.image);

    setEditChestS(p.sizes.S.chest || 90);
    setEditChestM(p.sizes.M.chest || 98);
    setEditChestL(p.sizes.L.chest || 106);
    setEditChestXL(p.sizes.XL.chest || 114);

    setEditWaistS(p.sizes.S.waist || 70);
    setEditWaistM(p.sizes.M.waist || 78);
    setEditWaistL(p.sizes.L.waist || 86);
    setEditWaistXL(p.sizes.XL.waist || 94);

    setEditHipsS(p.sizes.S.hips || 90);
    setEditHipsM(p.sizes.M.hips || 98);
    setEditHipsL(p.sizes.L.hips || 106);
    setEditHipsXL(p.sizes.XL.hips || 114);
  };

  // Save Edits Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGarment) return;

    const updated: Garment = {
      ...editingGarment,
      name: editName.toUpperCase(),
      category: editCategory,
      price: editPrice,
      cost: editCost,
      description: editDescription,
      technicalDetails: editDetails.split(',').map((d) => d.trim()).filter(Boolean),
      sizes: {
        S: { chest: editChestS, waist: editWaistS, hips: editHipsS, height: editingGarment.sizes.S.height || 165 },
        M: { chest: editChestM, waist: editWaistM, hips: editHipsM, height: editingGarment.sizes.M.height || 170 },
        L: { chest: editChestL, waist: editWaistL, hips: editHipsL, height: editingGarment.sizes.L.height || 175 },
        XL: { chest: editChestXL, waist: editWaistXL, hips: editHipsXL, height: editingGarment.sizes.XL.height || 180 },
      },
      colorTheme: {
        primary: editPrimaryGlow,
        secondary: editSecondaryGlow,
        glow: `${editPrimaryGlow}40`,
        glowRgb: '213, 0, 249',
      },
      visualStyle: {
        type: editVisualType,
        primaryColor: '#12121e',
        accentColor: editPrimaryGlow,
        glowingLines: true,
      },
      gender: editGender,
      image: editImagePath,
    };

    updateProduct(updated);
    setEditingGarment(null);
    alert(`Garment "${updated.name}" updated successfully!`);
  };

  // Delete Product Handler
  const handleDeleteProduct = (p: Garment) => {
    if (window.confirm(`Are you absolutely sure you want to delete "${p.name}"? This action is irreversible.`)) {
      deleteProduct(p.id);
      alert(`Garment "${p.name}" removed from catalogue.`);
    }
  };

  // Inline Stock Adjuster
  const handleUpdateStock = (p: Garment, size: 'S' | 'M' | 'L' | 'XL', newQty: number) => {
    if (newQty < 0) return;
    const updated = {
      ...p,
      inventory: {
        ...p.inventory,
        [size]: newQty
      }
    };
    updateProduct(updated);
  };

  // Global Valuation Calculations
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const totalStockUnits = products.reduce((sum, p) => 
    sum + (p.inventory?.S || 0) + (p.inventory?.M || 0) + (p.inventory?.L || 0) + (p.inventory?.XL || 0), 0
  );

  const inventoryRetailValuation = products.reduce((sum, p) => {
    const qty = (p.inventory?.S || 0) + (p.inventory?.M || 0) + (p.inventory?.L || 0) + (p.inventory?.XL || 0);
    return sum + (p.price * qty);
  }, 0);

  const projectedProfitMargin = products.reduce((sum, p) => {
    const qty = (p.inventory?.S || 0) + (p.inventory?.M || 0) + (p.inventory?.L || 0) + (p.inventory?.XL || 0);
    const manufacturingCost = p.cost !== undefined ? p.cost : Math.round(p.price * 0.7);
    return sum + ((p.price - manufacturingCost) * qty);
  }, 0);

  // Find Low Stock Alerts (Stock Level <= 3)
  const lowStockItems = products.filter(p => 
    (p.inventory?.S <= 3) ||
    (p.inventory?.M <= 3) ||
    (p.inventory?.L <= 3) ||
    (p.inventory?.XL <= 3)
  );

  // Filter products for the Inventory Tab
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesGender = filterGender === 'All' || p.gender === filterGender;
    const matchesLowStock = !showLowStock || (
      (p.inventory?.S <= 3) || (p.inventory?.M <= 3) || (p.inventory?.L <= 3) || (p.inventory?.XL <= 3)
    );
    return matchesSearch && matchesCategory && matchesGender && matchesLowStock;
  });

  return (
    <div className="min-h-screen bg-cyber-dark text-white relative flex flex-col justify-between font-sans selection:bg-cyber-purple/30 selection:text-white">
      <div className="absolute inset-0 grid-drift-effect opacity-10 pointer-events-none" />

      {/* Admin Nav */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-6 border-b border-white/5 bg-cyber-dark/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2.5 rounded-full border border-white/10 text-white/50 hover:text-white transition-all bg-white/[0.02] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img src="/logo.png" alt="Abstract Logo" className="w-12 h-12 object-contain rounded-lg border border-cyber-purple/35 shadow-[0_0_20px_rgba(213,0,249,0.2)]" />
          <div>
            <h1 className="font-mono text-base font-bold tracking-widest text-cyber-purple text-glow-purple flex items-center gap-2">
              ADMIN CONTROL PANEL
            </h1>
            <span className="font-mono text-[10px] text-white/30 tracking-widest">
              OVERRIDE PERMISSIONS ACQUIRED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-white/40">
          <span>OPERATOR: {user.username}</span>
          <span className="text-cyber-purple font-bold uppercase bg-cyber-purple/5 border border-cyber-purple/20 px-2 py-0.5 rounded">
            ROOT_NODE
          </span>
        </div>
      </header>

      {/* Sub-Header Tabbed Controller */}
      <div className="relative z-20 border-b border-white/5 bg-cyber-dark/20 backdrop-blur-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {[
            { id: 'diagnostics', label: 'SYSTEM DIAGNOSTICS', icon: Cpu },
            { id: 'inventory', label: 'INVENTORY DATABASE', icon: Package },
            { id: 'injector', label: 'CATALOG INJECTOR', icon: Plus },
            { id: 'orders', label: 'ORDER STREAM', icon: ClipboardList },
            { id: 'inquiries', label: 'BESPOKE STUDIO', icon: Palette },
            { id: 'security', label: 'SECURITY ACCESS', icon: UserCog }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[12px] tracking-wider transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? `bg-white/10 border-white/15 text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                    : `border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Core Dashboard Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-8"
          >
            
            {/* ─────────────── TAB: DIAGNOSTICS ─────────────── */}
            {activeTab === 'diagnostics' && (
              <div className="space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-white/40 tracking-wider">ACCRUED CREDIT VOLUME</span>
                      <div className="font-mono text-2xl font-bold text-cyber-purple text-glow-purple">LKR {revenue.toLocaleString()}</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-cyber-purple opacity-30" />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-purple opacity-50" />
                  </div>

                  <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-white/40 tracking-wider">STOCK UNITS ONLINE</span>
                      <div className="font-mono text-2xl font-bold text-cyber-green text-glow-green">{totalStockUnits} Units</div>
                    </div>
                    <Package className="w-8 h-8 text-cyber-green opacity-30" />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-green opacity-50" />
                  </div>

                  <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-white/40 tracking-wider">RETAIL INVENTORY VALUE</span>
                      <div className="font-mono text-2xl font-bold text-cyber-blue">LKR {inventoryRetailValuation.toLocaleString()}</div>
                    </div>
                    <Coins className="w-8 h-8 text-cyber-blue opacity-30" />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyber-blue opacity-50" />
                  </div>

                  <div className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-white/40 tracking-wider">PROJECTED PROFIT MARGIN</span>
                      <div className="font-mono text-2xl font-bold text-amber-400">LKR {projectedProfitMargin.toLocaleString()}</div>
                    </div>
                    <BarChart3 className="w-8 h-8 text-amber-500 opacity-30" />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Low Stock Watch */}
                  <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <div>
                        <h3 className="font-mono text-sm tracking-widest text-amber-500 font-semibold">
                          LOW STOCK ALERTS (&le; 3 units)
                        </h3>
                        <p className="text-xs text-white/40">Critical stock depletion warnings requiring restocking actions</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[350px] space-y-2 pr-1">
                      {lowStockItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-white/20 py-12">
                          <CheckCircle2 className="w-8 h-8 mb-2 text-cyber-green animate-pulse" />
                          <span className="font-mono text-xs tracking-wider">ALL STOCK LEVELS HEALTHY</span>
                        </div>
                      ) : (
                        lowStockItems.map((p) => {
                          const lowSizes: string[] = [];
                          if (p.inventory.S <= 3) lowSizes.push(`S (${p.inventory.S})`);
                          if (p.inventory.M <= 3) lowSizes.push(`M (${p.inventory.M})`);
                          if (p.inventory.L <= 3) lowSizes.push(`L (${p.inventory.L})`);
                          if (p.inventory.XL <= 3) lowSizes.push(`XL (${p.inventory.XL})`);
                          return (
                            <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 font-mono text-xs">
                              <div className="flex items-center gap-3">
                                <img src={p.image} className="w-8 h-8 rounded object-cover border border-white/10 bg-black/40" />
                                <div>
                                  <span className="font-bold text-white uppercase">{p.name}</span>
                                  <div className="text-[10px] text-white/50">{p.category} &middot; {p.gender}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-amber-400 font-bold">LOW SIZE: {lowSizes.join(', ')}</span>
                                <button
                                  onClick={() => { setActiveTab('inventory'); handleOpenEditModal(p); }}
                                  className="block text-[10px] text-cyber-blue hover:underline font-semibold cursor-pointer mt-1"
                                >
                                  RESTOCK MODULE &rarr;
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Quick System Telemetry Log */}
                  <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                      <Terminal className="w-4 h-4 text-cyber-purple" />
                      <div>
                        <h3 className="font-mono text-xs tracking-widest text-cyber-purple font-semibold">
                          TELEMETRY FEED
                        </h3>
                        <p className="text-[10px] text-white/30">System processes and queue telemetry log</p>
                      </div>
                    </div>

                    <div className="flex-1 font-mono text-[11px] text-white/50 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      <div className="text-cyber-green">[SYSTEM] MATRIX INTERFACE SECURED</div>
                      <div className="text-white/30">[SYS_LOG] Core config loaded from db.ts</div>
                      <div className="text-cyber-blue">[METRICS] Active catalog contains {products.length} active models</div>
                      <div className="text-cyber-purple">[ORDERS] Transaction log stream initialized</div>
                      {orders.length > 0 && (
                        <div className="text-white/70">[LOG] Last order: {orders[0].id} by {orders[0].user}</div>
                      )}
                      <div className="text-amber-500">[ALERTS] Found {lowStockItems.length} modules requiring inventory maintenance</div>
                      <div className="text-white/30">[MONITOR] Health check status 200 OK</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────── TAB: INVENTORY DATABASE ─────────────── */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {/* Search, Filter & Utility Row */}
                <div className="glass p-5 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-md">
                    <input
                      type="text"
                      placeholder="Search inventory by name, ID, category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 focus:border-cyber-blue py-2.5 pl-10 pr-4 rounded-xl text-xs font-mono text-white transition-all outline-none"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-white/40">CAT:</span>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as any)}
                        className="bg-cyber-dark border border-white/10 py-1.5 px-3 rounded-lg text-xs font-mono text-white outline-none focus:border-cyber-blue"
                      >
                        <option value="All">All Categories</option>
                        <option value="Top">Tops</option>
                        <option value="Bottom">Bottoms</option>
                        <option value="Outerwear">Outerwear</option>
                      </select>
                    </div>

                    {/* Gender Filter */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-white/40">GENDER:</span>
                      <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value as any)}
                        className="bg-cyber-dark border border-white/10 py-1.5 px-3 rounded-lg text-xs font-mono text-white outline-none focus:border-cyber-blue"
                      >
                        <option value="All">All Genders</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    {/* Low stock check */}
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-white/60 hover:text-white select-none">
                      <input
                        type="checkbox"
                        checked={showLowStock}
                        onChange={(e) => setShowLowStock(e.target.checked)}
                        className="w-3.5 h-3.5 accent-cyber-blue"
                      />
                      Low Stock Only
                    </label>
                  </div>
                </div>

                {/* Main Table Layout */}
                <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-white/[0.02] border-b border-white/5 text-white/40">
                        <tr>
                          <th className="py-4 px-6">MODEL DETECT</th>
                          <th className="py-4 px-6">PRICE</th>
                          <th className="py-4 px-6 text-center">QUANTITY LEVEL PER SIZE (S / M / L / XL)</th>
                          <th className="py-4 px-6 text-center">TOTAL STOCK</th>
                          <th className="py-4 px-6 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-white/20">
                              <Terminal className="w-8 h-8 mx-auto mb-2 text-white/20 animate-pulse" />
                              <span>NO PRODUCTS DETECTED IN SELECTED TELEMETRY GRID</span>
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => {
                            const totalStock = (p.inventory?.S || 0) + (p.inventory?.M || 0) + (p.inventory?.L || 0) + (p.inventory?.XL || 0);
                            const isLowStock = p.inventory?.S <= 3 || p.inventory?.M <= 3 || p.inventory?.L <= 3 || p.inventory?.XL <= 3;
                            return (
                              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10" />
                                    <div>
                                      <p className="font-bold text-white uppercase text-glow-purple">{p.name}</p>
                                      <p className="text-[10px] text-white/30 break-all">{p.id}</p>
                                      <div className="flex gap-1.5 mt-1">
                                        <span className="text-[9px] bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple px-1.5 py-0.5 rounded uppercase">{p.category}</span>
                                        <span className="text-[9px] bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue px-1.5 py-0.5 rounded uppercase">{p.gender}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-bold">
                                  <p className="text-white">LKR {p.price.toLocaleString()}</p>
                                  {p.cost !== undefined && (
                                    <p className="text-[9px] text-white/30 font-normal">Cost: LKR {p.cost.toLocaleString()}</p>
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex justify-center gap-2">
                                    {(['S', 'M', 'L', 'XL'] as const).map((size) => {
                                      const stockVal = p.inventory?.[size] ?? 0;
                                      return (
                                        <div key={size} className={`flex flex-col items-center border rounded-lg px-1.5 py-0.5 min-w-[50px] bg-black/30 ${stockVal <= 3 ? 'border-amber-500/30' : 'border-white/5'}`}>
                                          <span className={`text-[8px] font-bold ${stockVal <= 3 ? 'text-amber-500' : 'text-white/30'}`}>{size}</span>
                                          <div className="flex items-center gap-1 mt-0.5">
                                            <button 
                                              onClick={() => handleUpdateStock(p, size, stockVal - 1)}
                                              className="w-3.5 h-3.5 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white/50 hover:text-white cursor-pointer active:scale-90 select-none"
                                            >
                                              -
                                            </button>
                                            <span className={`text-[11px] font-bold ${stockVal <= 3 ? 'text-amber-400' : 'text-white'}`}>{stockVal}</span>
                                            <button 
                                              onClick={() => handleUpdateStock(p, size, stockVal + 1)}
                                              className="w-3.5 h-3.5 rounded bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white/50 hover:text-white cursor-pointer active:scale-90 select-none"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  {totalStock === 0 ? (
                                    <span className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-500/10 font-bold uppercase">OUT_OF_STOCK</span>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center">
                                      <span className={`font-bold text-sm ${isLowStock ? 'text-amber-400' : 'text-cyber-green'}`}>{totalStock}</span>
                                      {isLowStock && <span className="text-[8px] text-amber-500 tracking-wider">RESTOCK_WARN</span>}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditModal(p)}
                                      className="p-1.5 rounded-lg border border-cyber-blue/30 text-cyber-blue bg-cyber-blue/5 hover:bg-cyber-blue/15 transition-all cursor-pointer"
                                      title="Edit Product Specs"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p)}
                                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-all cursor-pointer"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────── TAB: CATALOG INJECTOR ─────────────── */}
            {activeTab === 'injector' && (
              <div className="glass rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <Plus className="w-5 h-5 text-cyber-green" />
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-cyber-green font-semibold">
                      CATALOG MATRIX INJECTOR
                    </h3>
                    <p className="text-xs text-white/40">Append custom garments to store catalog database</p>
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

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left Form Specs */}
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

                    <div className="grid grid-cols-3 gap-4">
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
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">PRICE (LKR)</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-4 rounded-xl text-xs font-mono text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">MFG COST (LKR)</label>
                        <input
                          type="number"
                          required
                          value={cost}
                          onChange={(e) => setCost(parseInt(e.target.value))}
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
                        rows={3}
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
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">DRAW SHAPE</label>
                        <select
                          value={visualType}
                          onChange={(e) => setVisualType(e.target.value as 'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt')}
                          className="bg-cyber-dark border border-white/10 hover:border-white/20 focus:border-cyber-green py-2.5 px-2 rounded-xl text-xs font-mono text-white outline-none"
                        >
                          <option value="blazer">Blazer</option>
                          <option value="parka">Parka</option>
                          <option value="trousers">Trousers</option>
                          <option value="frock">Frock</option>
                          <option value="skirt">Skirt</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">PRIMARY GLOW</label>
                        <input
                          type="color"
                          value={primaryGlow}
                          onChange={(e) => setPrimaryGlow(e.target.value)}
                          className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">SECONDARY</label>
                        <input
                          type="color"
                          value={secondaryGlow}
                          onChange={(e) => setSecondaryGlow(e.target.value)}
                          className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">GENDER TARGET</label>
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
                        <label className="font-mono text-[10px] text-white/50 tracking-wider">IMAGE PATH</label>
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
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] text-white/40 tracking-wider block border-b border-white/5 pb-1">
                        TECHNICAL BODY GUIDE (Chest / Waist / Hips in cm)
                      </span>

                      {/* Sizing Guides Grid */}
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <span className="font-mono text-[10px] text-white/30 self-center">SIZE</span>
                        <span className="font-mono text-[10px] text-white/50 font-bold">CHEST</span>
                        <span className="font-mono text-[10px] text-white/50 font-bold">WAIST</span>
                        <span className="font-mono text-[10px] text-white/50 font-bold">HIPS</span>

                        {/* Size S */}
                        <span className="font-mono text-xs text-cyber-purple self-center font-bold">S</span>
                        <input
                          type="number"
                          value={chestS}
                          onChange={(e) => setChestS(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={waistS}
                          onChange={(e) => setWaistS(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={hipsS}
                          onChange={(e) => setHipsS(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />

                        {/* Size M */}
                        <span className="font-mono text-xs text-cyber-purple self-center font-bold">M</span>
                        <input
                          type="number"
                          value={chestM}
                          onChange={(e) => setChestM(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={waistM}
                          onChange={(e) => setWaistM(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={hipsM}
                          onChange={(e) => setHipsM(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />

                        {/* Size L */}
                        <span className="font-mono text-xs text-cyber-purple self-center font-bold">L</span>
                        <input
                          type="number"
                          value={chestL}
                          onChange={(e) => setChestL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={waistL}
                          onChange={(e) => setWaistL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={hipsL}
                          onChange={(e) => setHipsL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />

                        {/* Size XL */}
                        <span className="font-mono text-xs text-cyber-purple self-center font-bold">XL</span>
                        <input
                          type="number"
                          value={chestXL}
                          onChange={(e) => setChestXL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={waistXL}
                          onChange={(e) => setWaistXL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                        <input
                          type="number"
                          value={hipsXL}
                          onChange={(e) => setHipsXL(parseInt(e.target.value))}
                          className="bg-white/[0.02] border border-white/10 py-1.5 px-1 rounded font-mono text-xs text-center text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-mono text-xs tracking-wider font-semibold bg-cyber-green text-black hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      MOUNT GARMENT MODULE
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ─────────────── TAB: ORDER STREAM ─────────────── */}
            {activeTab === 'orders' && (
              <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <ClipboardList className="w-5 h-5 text-cyber-purple" />
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-cyber-purple font-semibold">
                      TRANSACTION RECEIPTS DATABASE
                    </h3>
                    <p className="text-xs text-white/40">Real-time order workflow management queue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {orders.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20">
                      <Terminal className="w-8 h-8 mb-2 animate-pulse" />
                      <span className="font-mono text-xs tracking-wider">ORDER DATABASE LOG EMPTY</span>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 font-mono text-xs">
                        <div className="flex justify-between items-center text-white/80 border-b border-white/5 pb-2">
                          <span className="text-cyber-green font-bold text-sm">{order.id}</span>
                          <span className="text-white/30 text-[10px]">{order.date}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-white/40">STATUS:</span>
                          {(!order.status || order.status === 'Pending Approval') && (
                            <span className="text-[10px] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded bg-amber-500/10 font-semibold font-mono">PENDING APPROVAL</span>
                          )}
                          {order.status === 'Pending Delivery' && (
                            <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-500/10 font-semibold font-mono">PENDING DELIVERY</span>
                          )}
                          {order.status === 'Dispatched' && (
                            <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10 font-semibold">DISPATCHED</span>
                          )}
                          {order.status === 'Discarded' && (
                            <span className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-500/10 font-semibold">DISCARDED</span>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-white/60">
                          <div className="flex justify-between">
                            <span className="text-white/40">CLIENT ID:</span>
                            <span>{order.user}</span>
                          </div>
                          {order.email && (
                            <div className="flex justify-between">
                              <span className="text-white/40">EMAIL:</span>
                              <span className="truncate max-w-[170px]">{order.email}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-white">
                            <span className="text-white/40">TOTAL VALUE:</span>
                            <span className="text-cyber-purple text-glow-purple">LKR {order.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/40">METHOD:</span>
                            <span className="uppercase">{order.paymentMethod}</span>
                          </div>
                        </div>

                        {order.deliveryDetails && (
                          <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-white/50 bg-black/20 p-2.5 rounded-xl">
                            <div className="text-[9px] text-cyber-purple font-bold tracking-wider mb-1 uppercase">DELIVERY TELEMETRY</div>
                            <div className="flex justify-between">
                              <span>RECIPIENT:</span>
                              <span className="text-white">{order.deliveryDetails.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>PHONE:</span>
                              <span className="text-white">{order.deliveryDetails.phone}</span>
                            </div>
                            <div className="flex justify-between items-start gap-2">
                              <span>ADDRESS:</span>
                              <span className="text-white text-right break-all max-w-[140px]">{order.deliveryDetails.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CITY:</span>
                              <span className="text-white">{order.deliveryDetails.city}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 my-1 border-t border-b border-white/5 py-2">
                          <span className="text-[9px] text-white/30 block uppercase font-bold">ITEMS BUNDLE</span>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-white/80">
                              <span className="truncate max-w-[160px] font-semibold">{item.garment.name}</span>
                              <span className="text-white/50">{item.size} &times; {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Workflow Action Buttons */}
                        {(!order.status || order.status === 'Pending Approval') && declineReasonForOrder !== order.id && (
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleAcceptOrder(order)}
                              disabled={processingOrder === order.id}
                              className="flex-1 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              {processingOrder === order.id ? 'ACCEPTING...' : 'ACCEPT'}
                            </button>
                            <button
                              onClick={() => { setDeclineReasonForOrder(order.id); setDeclineOrderReasonText(''); }}
                              disabled={processingOrder === order.id}
                              className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              DISCARD
                            </button>
                          </div>
                        )}

                        {declineReasonForOrder === order.id && (
                          <div className="flex flex-col gap-2 mt-1">
                            <textarea
                              value={declineOrderReasonText}
                              onChange={(e) => setDeclineOrderReasonText(e.target.value)}
                              placeholder="Reason for discarding order..."
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-sans text-white resize-none outline-none focus:border-red-500/50"
                              rows={2}
                            />
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setDeclineReasonForOrder(null)}
                                disabled={processingOrder === order.id}
                                className="flex-1 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white bg-white/[0.02] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                CANCEL
                              </button>
                              <button
                                onClick={() => handleDeclineOrder(order)}
                                disabled={processingOrder === order.id}
                                className="flex-1 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                {processingOrder === order.id ? 'SENDING...' : 'CONFIRM'}
                              </button>
                            </div>
                          </div>
                        )}

                        {order.status === 'Pending Delivery' && (
                          <button
                            onClick={() => handleDispatchOrder(order.id)}
                            className="w-full py-2 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 hover:bg-cyber-purple/35 text-cyber-purple text-xs font-bold transition-all cursor-pointer"
                          >
                            DISPATCH TO COURIER
                          </button>
                        )}

                        {order.status === 'Dispatched' && (
                          <div className="text-center text-emerald-400 font-bold py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[10px]">
                            [+] DISPATCHED TO COURIER TEAM
                          </div>
                        )}

                        {order.status === 'Discarded' && (
                          <div className="text-red-400 text-[10px] flex flex-col gap-0.5 bg-red-500/5 border border-red-500/20 p-2 rounded-lg">
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
            )}

            {/* ─────────────── TAB: BESPOKE STUDIO ─────────────── */}
            {activeTab === 'inquiries' && (
              <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4 mb-6">
                  <Palette className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-amber-500 font-semibold">CUSTOM DESIGN INQUIRIES</h3>
                    <p className="text-xs text-white/40">Bespoke luxury requests submitted by boutique customers</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {customInquiries.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20">
                      <span className="font-mono text-xs tracking-wider">NO CUSTOM DESIGN INQUIRIES ON FILE</span>
                    </div>
                  ) : (
                    customInquiries.map((inquiry, i) => (
                      <div key={inquiry.id || i} className="p-4.5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-3 font-mono text-xs relative group">
                        <div className="flex justify-between items-start border-b border-white/5 pb-2">
                          <span className="text-amber-500 font-bold text-sm">{inquiry.id}</span>
                          <div className="flex items-center gap-2">
                            {inquiry.status === 'accepted' && <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10 font-bold">ACCEPTED</span>}
                            {inquiry.status === 'declined' && <span className="text-[10px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/10 font-bold">DECLINED</span>}
                            {!inquiry.status && <span className="text-[10px] text-white/30">{inquiry.submittedAt}</span>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-white/70">
                          <span>CLIENT: <span className="text-white font-semibold">{inquiry.name}</span></span>
                          <span>CONTACT: <span className="text-white font-semibold">{inquiry.contact}</span></span>
                          <span>BUDGET: <span className="text-white font-bold text-amber-400">{inquiry.budget}</span></span>
                        </div>
                        
                        <div className="text-white/50 mt-1 space-y-1">
                          <span className="text-[10px] text-white/40 block uppercase font-bold">GARMENT SPEC: {inquiry.garmentType}</span>
                          <p className="text-[11px] leading-relaxed break-words whitespace-pre-wrap text-white/80">{inquiry.description}</p>
                          {inquiry.colorPreference && (
                            <p className="text-[10px]"><span className="text-white/40">COLOR PREF:</span> {inquiry.colorPreference}</p>
                          )}
                        </div>
                        
                        {inquiry.referenceImage && (
                          <div className="mt-2 pt-3 border-t border-white/5 relative group/img overflow-hidden rounded-xl">
                            <span className="text-[9px] text-white/40 block mb-2">REFERENCE GRID</span>
                            <img src={inquiry.referenceImage} alt="Ref" className="w-full h-36 object-cover bg-black/40 border border-white/10 transition-transform duration-300 group-hover/img:scale-105 rounded-lg" />
                            <div className="absolute inset-0 top-6 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <button
                                onClick={() => downloadPDF(inquiry)}
                                className="flex items-center gap-1.5 bg-white text-black px-3.5 py-2 rounded-full text-[11px] font-bold hover:scale-105 transition-transform cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> PRINT SPEC PDF
                              </button>
                            </div>
                          </div>
                        )}

                        {!inquiry.status && declineReasonFor !== inquiry.id && (
                          <div className="flex gap-2 mt-2 pt-3 border-t border-white/5">
                            <button
                              onClick={() => handleAcceptInquiry(inquiry)}
                              disabled={processingInquiry === inquiry.id}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" /> {processingInquiry === inquiry.id ? 'SENDING...' : 'ACCEPT'}
                            </button>
                            <button
                              onClick={() => { setDeclineReasonFor(inquiry.id); setDeclineReason(''); }}
                              disabled={processingInquiry === inquiry.id}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" /> DECLINE
                            </button>
                          </div>
                        )}

                        {!inquiry.status && declineReasonFor === inquiry.id && (
                          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
                            <textarea
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                              placeholder="Reason for declining..."
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-sans text-white resize-none outline-none focus:border-red-500/50"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => setDeclineReasonFor(null)}
                                disabled={processingInquiry === inquiry.id}
                                className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white bg-white/[0.02] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                CANCEL
                              </button>
                              <button
                                onClick={() => handleDeclineInquiry(inquiry)}
                                disabled={processingInquiry === inquiry.id}
                                className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
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
            )}

            {/* ─────────────── TAB: SECURITY OVERRIDE ─────────────── */}
            {activeTab === 'security' && (
              <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4 mb-6">
                  <UserCog className="w-5 h-5 text-cyber-purple" />
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-cyber-purple font-semibold">ADMIN TEAM MANAGEMENT</h3>
                    <p className="text-xs text-white/40">Manage administrator identities — only accessible to root nodes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Create Admin Form */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs text-white/60 tracking-wider">CREATE NEW ADMIN PROFILE</h4>

                    {adminSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {adminSuccess}
                      </motion.div>
                    )}
                    {adminError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {adminError}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 font-mono">
                      <label className="text-[10px] text-white/50 tracking-wider">USERNAME</label>
                      <input
                        type="text"
                        placeholder="e.g. manager_lisa"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-purple py-2.5 px-4 rounded-xl text-xs text-white transition-all outline-none placeholder-white/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 font-mono">
                      <label className="text-[10px] text-white/50 tracking-wider">PASSWORD</label>
                      <div className="relative">
                        <input
                          type={showAdminPw ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-cyber-purple py-2.5 px-4 pr-11 rounded-xl text-xs text-white transition-all outline-none placeholder-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none cursor-pointer"
                        >
                          {showAdminPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 font-mono">
                      <label className="text-[10px] text-white/50 tracking-wider">GENDER</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAdminGender('Female')}
                          className={`py-2.5 rounded-xl border text-xs font-semibold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none ${
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
                          className={`py-2.5 rounded-xl border text-xs font-semibold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none ${
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
                  <div className="space-y-4 font-mono">
                    <h4 className="text-xs text-white/60 tracking-wider">CURRENT ADMINISTRATOR ACCOUNTS</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {registeredUsers.filter((u) => u.role === 'Admin').map((u) => (
                        <div
                          key={u.username}
                          className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center">
                              <span className="text-cyber-purple text-[11px] font-bold">{u.username[0].toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white/95 font-semibold">{u.username}</p>
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
                                className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer font-bold font-mono"
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
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─────────────── EDIT PRODUCT MODAL ─────────────── */}
      <AnimatePresence>
        {editingGarment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-4xl w-full rounded-3xl p-6 md:p-8 border border-cyber-blue/30 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto text-white"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-mono text-sm tracking-widest text-cyber-blue font-bold flex items-center gap-2">
                    <Settings className="w-4 h-4 animate-spin-slow" />
                    EDIT GARMENT TELEMETRY
                  </h3>
                  <p className="font-mono text-xs text-white/40 uppercase mt-0.5">Model: {editingGarment.id}</p>
                </div>
                <button
                  onClick={() => setEditingGarment(null)}
                  className="p-1 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.02] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEdit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Attributes */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/50 tracking-wider">PRODUCT NAME</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">CATEGORY</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="bg-cyber-dark border border-white/10 py-2.5 px-4 rounded-xl text-white outline-none"
                      >
                        <option value="Outerwear">Outerwear</option>
                        <option value="Top">Top</option>
                        <option value="Bottom">Bottom</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">PRICE (LKR)</label>
                      <input
                        type="number"
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">COST (LKR)</label>
                      <input
                        type="number"
                        required
                        value={editCost}
                        onChange={(e) => setEditCost(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/50 tracking-wider">DESCRIPTION</label>
                    <textarea
                      required
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/50 tracking-wider">TECHNICAL SPECS (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">VISUAL MODEL</label>
                      <select
                        value={editVisualType}
                        onChange={(e) => setEditVisualType(e.target.value as any)}
                        className="bg-cyber-dark border border-white/10 py-2.5 px-2 rounded-xl text-white outline-none"
                      >
                        <option value="blazer">Blazer</option>
                        <option value="parka">Parka</option>
                        <option value="trousers">Trousers</option>
                        <option value="frock">Frock</option>
                        <option value="skirt">Skirt</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">PRIMARY GLOW</label>
                      <input
                        type="color"
                        value={editPrimaryGlow}
                        onChange={(e) => setEditPrimaryGlow(e.target.value)}
                        className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">SECONDARY</label>
                      <input
                        type="color"
                        value={editSecondaryGlow}
                        onChange={(e) => setEditSecondaryGlow(e.target.value)}
                        className="w-full bg-transparent border border-white/10 h-9 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">GENDER TARGET</label>
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value as any)}
                        className="bg-cyber-dark border border-white/10 py-2.5 px-4 rounded-xl text-white outline-none"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 tracking-wider">IMAGE PATH</label>
                      <input
                        type="text"
                        required
                        value={editImagePath}
                        onChange={(e) => setEditImagePath(e.target.value)}
                        className="bg-white/[0.02] border border-white/10 focus:border-cyber-blue py-2.5 px-4 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right sizing coordinates */}
                <div className="space-y-6 flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-4">
                    <span className="text-white/40 tracking-wider block border-b border-white/5 pb-1 uppercase font-bold">
                      BODY GUIDE DIMENSIONS (Chest / Waist / Hips in cm)
                    </span>

                    {/* Sizing Guides Grid */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <span className="text-white/30 self-center">SIZE</span>
                      <span className="text-white/50 font-bold">CHEST</span>
                      <span className="text-white/50 font-bold">WAIST</span>
                      <span className="text-white/50 font-bold">HIPS</span>

                      {/* Size S */}
                      <span className="font-bold text-cyber-blue self-center">S</span>
                      <input
                        type="number"
                        value={editChestS}
                        onChange={(e) => setEditChestS(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editWaistS}
                        onChange={(e) => setEditWaistS(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editHipsS}
                        onChange={(e) => setEditHipsS(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />

                      {/* Size M */}
                      <span className="font-bold text-cyber-blue self-center">M</span>
                      <input
                        type="number"
                        value={editChestM}
                        onChange={(e) => setEditChestM(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editWaistM}
                        onChange={(e) => setEditWaistM(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editHipsM}
                        onChange={(e) => setEditHipsM(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />

                      {/* Size L */}
                      <span className="font-bold text-cyber-blue self-center">L</span>
                      <input
                        type="number"
                        value={editChestL}
                        onChange={(e) => setEditChestL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editWaistL}
                        onChange={(e) => setEditWaistL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editHipsL}
                        onChange={(e) => setEditHipsL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />

                      {/* Size XL */}
                      <span className="font-bold text-cyber-blue self-center">XL</span>
                      <input
                        type="number"
                        value={editChestXL}
                        onChange={(e) => setEditChestXL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editWaistXL}
                        onChange={(e) => setEditWaistXL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                      <input
                        type="number"
                        value={editHipsXL}
                        onChange={(e) => setEditHipsXL(parseInt(e.target.value))}
                        className="bg-white/[0.02] border border-white/10 py-2 px-1 rounded text-center text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setEditingGarment(null)}
                      className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/50 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer font-bold font-mono uppercase text-xs"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl font-mono text-xs tracking-wider font-bold bg-cyber-blue text-black hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      SAVE TELEMETRY
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-30 border-t border-white/5 bg-cyber-dark/80 backdrop-blur-md py-6 px-6 text-center text-white/30 text-[10px] font-mono">
        <span>&copy; 2026 AETHER OVERRIDE CORE LOGS. AUTHORIZED ADMINISTRATOR ONLY.</span>
      </footer>

    </div>
  );
}
