'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Landmark, Upload, ShieldCheck, ShoppingBag, Eye, Clock, CheckCircle2, AlertTriangle, AlertCircle, Star } from 'lucide-react';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyAccountModal({ isOpen, onClose }: MyAccountModalProps) {
  const { user, orders, updateProfile, updateOrderStatus, addReview } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  
  // Profile Form States
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [gender, setGender] = useState<'Male' | 'Female'>(user?.gender || 'Female');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  // Review states
  const [reviewingOrder, setReviewingOrder] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setGender(user.gender || 'Female');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Filter orders for this customer
  const myOrders = orders.filter(
    (order) => order.user.toLowerCase() === user.username.toLowerCase()
  );

  // Handle Profile Picture Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload profile picture');
      }

      setProfilePicture(data.path);
      setSuccessMsg('Picture uploaded successfully! Click save to update your profile.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle Profile Details Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateProfile({
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        gender,
        profilePicture,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to update profile');
      }

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // User Initials for fallback avatar
  const getInitials = () => {
    return user.username.slice(0, 2).toUpperCase();
  };

  // Timeline Tracker Steps
  const getTimelineSteps = (status: string, declineReason?: string) => {
    const steps = [
      { id: 'placed', label: 'Order Placed', desc: 'Secure order processed', active: true, completed: true },
      { id: 'validation', label: 'Form Validation', desc: 'Bank & inventory check', active: false, completed: false },
      { id: 'dispatched', label: 'Dispatched', desc: 'Out for delivery', active: false, completed: false },
      { id: 'completed', label: 'Completed', desc: 'Package delivered', active: false, completed: false }
    ];

    if (status === 'Pending Approval') {
      steps[1].active = true;
    } else if (status === 'Pending Delivery') {
      steps[1].completed = true;
      steps[2].active = true;
    } else if (status === 'Dispatched') {
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].active = true;
    } else if (status === 'Discarded') {
      steps[1].completed = false;
      steps[2].completed = false;
      steps[3] = {
        id: 'discarded',
        label: 'Discarded',
        desc: declineReason || 'Order declined by bank/admin',
        active: true,
        completed: false
      };
    } else if (status === 'Completed') {
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].completed = true;
    } else {
      // Completed fallback
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].completed = true;
    }

    return steps;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        
        {/* Modal container card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl glass rounded-[28px] overflow-hidden border border-white/10 shadow-2xl p-6 md:p-8 text-white flex flex-col max-h-[90vh]"
        >
          {/* Header Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all bg-white/[0.01] focus:outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User profile brief card header */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/15 group-hover:opacity-75 transition-opacity"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center font-mono text-xl font-bold text-white/70 tracking-wider">
                  {getInitials()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                title="Upload Profile Picture"
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] text-white/40 tracking-widest font-semibold uppercase">
                COUTURE ACCOUNT PROFILE
              </span>
              <h3 className="text-xl font-black tracking-wider text-white uppercase flex items-center gap-2">
                {user.username}
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] font-mono border border-[var(--theme-primary)]/20 uppercase tracking-widest">
                  {user.role}
                </span>
              </h3>
              <span className="font-mono text-[10px] text-white/50 mt-0.5">
                {user.email || 'NO_EMAIL_LINKED@ABSTRACT.LK'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-4 mb-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider border transition-all cursor-pointer focus:outline-none ${
                activeTab === 'profile'
                  ? 'bg-white text-black border-white'
                  : 'border-white/5 text-white/40 hover:text-white bg-white/[0.01]'
              }`}
            >
              PROFILE DETAILS
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider border transition-all cursor-pointer focus:outline-none flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-white text-black border-white'
                  : 'border-white/5 text-white/40 hover:text-white bg-white/[0.01]'
              }`}
            >
              ORDER TRACKING
              {myOrders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-black font-mono">
                  {myOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Form / Scroll Container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 animate-pulse" />
                {successMsg}
              </div>
            )}
            {uploading && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 animate-spin" />
                Uploading image... please wait.
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.form
                  key="profile-form"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={handleSaveProfile}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] tracking-wider text-white/50 flex items-center gap-1.5 uppercase font-bold">
                        <Mail className="w-3 h-3" /> EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] tracking-wider text-white/50 flex items-center gap-1.5 uppercase font-bold">
                        <Phone className="w-3 h-3" /> PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Address Input */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="font-mono text-[9px] tracking-wider text-white/50 flex items-center gap-1.5 uppercase font-bold">
                        <MapPin className="w-3 h-3" /> STREET ADDRESS
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="No. 45, Couture Lane"
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>

                    {/* City Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] tracking-wider text-white/50 flex items-center gap-1.5 uppercase font-bold">
                        <Landmark className="w-3 h-3" /> CITY
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Colombo"
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="font-mono text-[9px] tracking-wider text-white/50 font-bold uppercase">GENDER STYLE THEME</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('Female')}
                        className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer focus:outline-none ${
                          gender === 'Female'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                            : 'border-white/5 text-white/40 hover:text-white bg-white/[0.01]'
                        }`}
                      >
                        FEMALE ♀
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('Male')}
                        className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer focus:outline-none ${
                          gender === 'Male'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                            : 'border-white/5 text-white/40 hover:text-white bg-white/[0.01]'
                        }`}
                      >
                        MALE ♂
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 mt-6 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isSaving ? 'PERSISTING PROFILE...' : 'SAVE PROFILE DETAILS'}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="orders-history"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  {myOrders.length === 0 ? (
                    <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                      <ShoppingBag className="w-8 h-8 text-white/25" />
                      <span className="font-mono text-xs text-white/40 uppercase">NO TRANSACTION MATRIX DETECTED</span>
                    </div>
                  ) : (
                    myOrders.map((order) => {
                      const timelineSteps = getTimelineSteps(order.status, order.declineReason);
                      return (
                        <div
                          key={order.id}
                          className="p-5 border border-white/10 rounded-2xl bg-white/[0.01] flex flex-col gap-5 hover:border-white/15 transition-all"
                        >
                          {/* Order Metadata header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[var(--theme-primary)]">{order.id}</span>
                              <span className="text-[10px] text-white/30 font-mono">·</span>
                              <span className="text-[10px] text-white/50 font-mono">{order.date}</span>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-3">
                              <span className="font-mono text-xs font-semibold">{order.paymentMethod}</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono border uppercase tracking-wider text-[10px] font-bold bg-white/5 border-white/10">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Items grid */}
                          <div className="flex flex-col gap-2 pl-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                                <span className="text-white/80 font-bold">
                                  {item.garment.name} ({item.size}) <span className="text-white/30 font-normal">x{item.quantity}</span>
                                </span>
                                <span className="text-white/50">LKR {item.garment.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between text-sm font-mono border-t border-white/5 pt-2 mt-1 font-black">
                              <span>TOTAL TRANSACTION</span>
                              <span className="text-[var(--theme-primary)]">LKR {order.total}</span>
                            </div>
                          </div>

                          {/* Tracking Timeline Graphic */}
                          <div className="flex flex-col gap-3 pt-2">
                            <span className="font-mono text-[9px] tracking-wider text-white/40 uppercase font-bold flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" /> DISPATCH TRACKING CORE
                            </span>

                            {/* Timeline container */}
                            <div className="grid grid-cols-4 gap-2 relative mt-2 pb-2">
                              {/* Horizontal track line */}
                              <div className="absolute top-3 left-[12%] right-[12%] h-0.5 bg-white/10 z-0" />
                              
                              {timelineSteps.map((step, sIdx) => {
                                const isDiscarded = step.id === 'discarded';
                                return (
                                  <div key={step.id} className="flex flex-col items-center text-center gap-1.5 z-10">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                        isDiscarded
                                          ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                                          : step.completed
                                          ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                          : step.active
                                          ? 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)] shadow-[0_0_10px_rgba(var(--theme-glow-rgb),0.3)] animate-pulse'
                                          : 'bg-black border-white/10 text-white/20'
                                      }`}
                                    >
                                      {isDiscarded ? (
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                      ) : step.completed ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <span
                                      className={`font-mono text-[8.5px] uppercase font-bold ${
                                        isDiscarded
                                          ? 'text-rose-400'
                                          : step.completed || step.active
                                          ? 'text-white'
                                          : 'text-white/30'
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                    <span className="text-[7.5px] text-white/30 leading-tight font-sans px-1 hidden md:block">
                                      {step.desc}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order Received Confirmation Button */}
                            {order.status === 'Dispatched' && (
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, 'Completed');
                                  setReviewingOrder(order);
                                  setReviewRating(5);
                                  setReviewComment('');
                                }}
                                className="w-full py-2.5 mt-2 rounded-xl font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRM ORDER RECEIVED
                              </button>
                            )}

                            {/* Discarded Reason Info Alert block */}
                            {order.status === 'Discarded' && order.declineReason && (
                              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[10px] text-rose-400/80 font-mono mt-1 flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                <span>
                                  <strong>DECLINE PROTOCOL INGESTED:</strong> {order.declineReason}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Review Feedback Popup */}
      <AnimatePresence>
        {reviewingOrder && (
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass rounded-[24px] border border-white/10 shadow-2xl p-6 md:p-8 text-white flex flex-col gap-5 text-left"
            >
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] text-[var(--theme-primary)] tracking-widest font-semibold uppercase flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[var(--theme-primary)] fill-[var(--theme-primary)]" /> VERIFIED ORDER FEEDBACK
                </span>
                <h3 className="text-lg font-black tracking-wider text-white uppercase mt-1">
                  LEAVE A REVIEW
                </h3>
                <p className="text-[10px] text-white/50 font-mono mt-0.5 uppercase">
                  ORDER ID: {reviewingOrder.id}
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] tracking-wider text-white/50 font-bold uppercase">RATING PROTOCOL</span>
                <div className="flex gap-2 justify-center py-2 bg-white/[0.02] border border-white/5 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none transition-all scale-100 hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= reviewRating
                            ? 'text-[var(--theme-primary)] fill-[var(--theme-primary)] filter drop-shadow-[0_0_8px_rgba(var(--theme-glow-rgb),0.5)]'
                            : 'text-white/10'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Text Area */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-wider text-white/50 font-bold uppercase">FEEDBACK COMMENT</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this design..."
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white focus:outline-none focus:border-white transition-all font-sans resize-none h-24"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setReviewingOrder(null)}
                  className="flex-1 py-3 rounded-xl font-mono text-xs font-bold border border-white/10 text-white/50 hover:text-white hover:border-white/20 bg-white/[0.01] transition-all cursor-pointer focus:outline-none"
                >
                  SKIP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addReview({
                      orderId: reviewingOrder.id,
                      username: user.username,
                      rating: reviewRating,
                      comment: reviewComment || 'Amazing design and service!',
                    });
                    setReviewingOrder(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-mono text-xs font-bold bg-white text-black hover:bg-white/90 transition-all cursor-pointer focus:outline-none"
                >
                  SUBMIT REVIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
