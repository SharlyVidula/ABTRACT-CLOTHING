'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Garment, GARMENTS } from '@/lib/garments';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePathname } from 'next/navigation';


// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredUser {
  username: string;
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
  credits?: number;
}

export interface CartItem {
  garment: Garment;
  size: 'S' | 'M' | 'L' | 'XL' | '2XL';
  quantity: number;
  paymentMethod: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: string;
  user: string;
  email?: string;
  status: 'Pending Approval' | 'Pending Delivery' | 'Dispatched' | 'Discarded' | 'Completed';
  declineReason?: string;
  deliveryDetails?: DeliveryDetails;
}

export interface Review {
  id: string;
  orderId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  published: boolean;
}

export interface UserSession {
  username: string;
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
  phone?: string;
  address?: string;
  city?: string;
  profilePicture?: string;
  credits?: number;
}

export type AuthResult = { success: boolean; error?: string };



// ─── Context Shape ────────────────────────────────────────────────────────────
interface StoreContextType {
  user: UserSession | null;
  cart: CartItem[];
  orders: Order[];
  products: Garment[];
  registeredUsers: StoredUser[];
  isCartOpen: boolean;
  genderMode: 'Male' | 'Female';
  reviews: Review[];
  setGenderMode: (gender: 'Male' | 'Female') => void;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string, gender: 'Male' | 'Female', email?: string) => Promise<AuthResult>;
  loginWithGoogle: (idToken: string) => Promise<AuthResult>;
  createAdminUser: (username: string, password: string, gender: 'Male' | 'Female') => Promise<AuthResult>;
  removeAdminUser: (username: string) => Promise<AuthResult>;
  logout: () => void;
  addToCart: (garment: Garment, size: 'S' | 'M' | 'L' | 'XL' | '2XL', quantity: number, paymentMethod: string) => void;
  removeFromCart: (index: number) => void;
  checkout: (deliveryDetails?: DeliveryDetails) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], declineReason?: string) => Promise<void>;
  addProduct: (garment: Garment) => void;
  updateProduct: (garment: Garment) => void;
  deleteProduct: (id: string) => void;
  setCartOpen: (open: boolean) => void;
  updateProfile: (details: { email?: string; phone?: string; address?: string; city?: string; gender?: 'Male' | 'Female'; profilePicture?: string; credits?: number }) => Promise<AuthResult>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'published'>) => Promise<void>;
  toggleReviewPublish: (reviewId: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  trackEvent: (eventType: string, details?: any) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
interface StoreProviderProps {
  children: React.ReactNode;
  initialProducts?: Garment[];
}

export function StoreProvider({ children, initialProducts }: StoreProviderProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Garment[]>(initialProducts || GARMENTS);
  const [isCartOpen, setCartOpen] = useState(false);
  const [genderMode, setGenderMode] = useState<'Male' | 'Female'>('Female');
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // ── Analytics Event Logging ──────────────────────────────────────────────────
  const pathname = usePathname();

  const getTokens = () => {
    if (typeof window === 'undefined') return { visitorToken: '', sessionToken: '' };
    
    let visitorToken = localStorage.getItem('abstract_visitor_token');
    if (!visitorToken) {
      visitorToken = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('abstract_visitor_token', visitorToken);
    }

    let sessionToken = sessionStorage.getItem('abstract_session_token');
    if (!sessionToken) {
      sessionToken = 's_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('abstract_session_token', sessionToken);
    }

    return { visitorToken, sessionToken };
  };

  const trackEvent = async (eventType: string, details?: any) => {
    if (user?.role === 'Admin') return; // Exclude admin actions for organic traffic stats
    try {
      const { visitorToken, sessionToken } = getTokens();
      const activeUser = user?.username || 'Guest';

      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          details,
          user: activeUser,
          sessionToken,
          visitorToken,
        }),
      });
    } catch (err) {
      console.error('Failed to log analytics event:', err);
    }
  };

  useEffect(() => {
    if (pathname) {
      trackEvent('page_view', { path: pathname, referrer: typeof document !== 'undefined' ? document.referrer : '' });
    }
  }, [pathname]);

  // ── Toast Timer Auto-dismiss ─────────────────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // ── Hydrate Session and Cart ──────────────────────────────────────────────
  useEffect(() => {
    // Active session
    const savedSession = localStorage.getItem('abstract_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession) as UserSession;
      setUser(parsed);
      if (parsed.gender) setGenderMode(parsed.gender);

      if (parsed.role === 'Admin') {
        setTimeout(() => {
          const { visitorToken, sessionToken } = getTokens();
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'clear_admin_telemetry',
              user: parsed.username,
              sessionToken,
              visitorToken,
            }),
          }).catch(() => {});
        }, 500);
      }
    }

    const savedCart = localStorage.getItem('abstract_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Products are already provided via `initialProducts` from the server layout —
    // no need to re-fetch them here. This removes a redundant cold DB round-trip
    // that was adding 2–5 s to every page load for every visitor.

    const loadReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews from DB:', err);
      }
    };
    loadReviews();

    const loadUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success && data.users) {
          setRegisteredUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to load users from DB:', err);
      }
    };
    loadUsers();
  }, []);

  // ── Load Orders Dynamically when session loads ───────────────────────────────
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const query = user ? `?username=${encodeURIComponent(user.username)}&role=${encodeURIComponent(user.role)}` : '';
        const res = await fetch(`/api/orders${query}`);
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders from DB:', err);
      }
    };
    loadOrders();
  }, [user]);

  // ── Auth helpers ───────────────────────────────────────────────────────────
  const login = async (username: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      
      const session: UserSession = { 
        username: data.user.username, 
        role: data.user.role, 
        gender: data.user.gender, 
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        profilePicture: data.user.profilePicture,
        credits: data.user.credits
      };
      if (session.role === 'Admin') {
        const { visitorToken, sessionToken } = getTokens();
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'clear_admin_telemetry',
            user: session.username,
            sessionToken,
            visitorToken,
          }),
        }).catch(() => {});
      }

      setUser(session);
      setGenderMode(data.user.gender);
      localStorage.setItem('abstract_session', JSON.stringify(session));
      showToast(`Welcome back, ${session.username}!`, 'success');
      if (session.role !== 'Admin') {
        trackEvent('sign_in', { username: session.username });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };

      const session: UserSession = { 
        username: data.user.username, 
        role: data.user.role, 
        gender: data.user.gender, 
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        profilePicture: data.user.profilePicture,
        credits: data.user.credits
      };
      if (session.role === 'Admin') {
        const { visitorToken, sessionToken } = getTokens();
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'clear_admin_telemetry',
            user: session.username,
            sessionToken,
            visitorToken,
          }),
        }).catch(() => {});
      }

      setUser(session);
      setGenderMode(data.user.gender);
      localStorage.setItem('abstract_session', JSON.stringify(session));
      showToast(`Welcome, ${session.username}! Google Identity Verified.`, 'success');
      if (session.role !== 'Admin') {
        trackEvent('sign_in', { username: session.username, method: 'google' });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google authentication failed' };
    }
  };

  const register = async (username: string, password: string, gender: 'Male' | 'Female', email?: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, gender, email })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      
      const session: UserSession = { 
        username: data.user.username, 
        role: data.user.role, 
        gender: data.user.gender, 
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        profilePicture: data.user.profilePicture,
        credits: data.user.credits
      };
      setUser(session);
      setGenderMode(data.user.gender);
      localStorage.setItem('abstract_session', JSON.stringify(session));
      showToast(`Profile registration verified. Welcome, ${session.username}!`, 'success');
      trackEvent('sign_up', { username: session.username, gender: session.gender });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Only callable when the current session is Admin
  const createAdminUser = async (username: string, password: string, gender: 'Male' | 'Female'): Promise<AuthResult> => {
    if (!user || user.role !== 'Admin') {
      return { success: false, error: 'Unauthorized — admin privileges required.' };
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, gender, role: 'Admin' })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      
      // Reload registeredUsers list from database
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (usersData.success && usersData.users) {
        setRegisteredUsers(usersData.users);
      }
      
      showToast(`Admin account "${username}" registered.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create admin' };
    }
  };

  const removeAdminUser = async (username: string): Promise<AuthResult> => {
    if (!user || user.role !== 'Admin') {
      return { success: false, error: 'Unauthorized — admin privileges required.' };
    }
    if (username === 'admin') {
      return { success: false, error: 'Cannot remove the default system administrator.' };
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', username })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };

      // Reload registeredUsers list from database
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (usersData.success && usersData.users) {
        setRegisteredUsers(usersData.users);
      }
      
      showToast(`Account "${username}" removed from registry.`, 'info');
      
      if (user.username === username) {
        logout();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to remove admin' };
    }
  };

  const logout = () => {
    if (user) {
      trackEvent('sign_out', { username: user.username });
    }
    showToast(`Terminal session logged out.`, 'info');
    setUser(null);
    localStorage.removeItem('abstract_session');
  };

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (garment: Garment, size: 'S' | 'M' | 'L' | 'XL' | '2XL', quantity: number, paymentMethod: string) => {
    const updated = [...cart, { garment, size, quantity, paymentMethod }];
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
    showToast(`"${garment.name}" added to cart successfully.`, 'success');
    trackEvent('add_to_cart', { garmentId: garment.id, garmentName: garment.name, size, quantity, price: garment.price });
  };

  const removeFromCart = (index: number) => {
    const item = cart[index];
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
    if (item) {
      showToast(`Removed "${item.garment.name}" from cart.`, 'info');
    }
  };

  const checkout = async (deliveryDetails?: DeliveryDetails) => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.garment.price * item.quantity, 0);
    const newOrder: Order = {
      id: 'TX_' + Math.random().toString(36).substring(3, 9).toUpperCase(),
      items: [...cart],
      total,
      paymentMethod: cart[0]?.paymentMethod || 'Cyber-Credits',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: user?.username || 'Guest',
      email: user?.email || undefined,
      status: 'Pending Approval',
      deliveryDetails,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', order: newOrder })
      });
      const data = await res.json();
      if (data.success) {
        trackEvent('checkout', { orderId: newOrder.id, total: newOrder.total, paymentMethod: newOrder.paymentMethod, itemsCount: newOrder.items.length });
        // Refresh orders list
        const query = user ? `?username=${encodeURIComponent(user.username)}&role=${encodeURIComponent(user.role)}` : '';
        const ordersRes = await fetch(`/api/orders${query}`);
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders);
        }

        // Update user credits balance in state if logged in
        if (user && data.newBalance !== undefined) {
          const updatedUser = { ...user, credits: data.newBalance };
          setUser(updatedUser);
          localStorage.setItem('abstract_session', JSON.stringify(updatedUser));
        }

        setCart([]);
        localStorage.removeItem('abstract_cart');
        setCartOpen(false);
      } else {
        console.error('Failed to submit order to DB:', data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], declineReason?: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', orderId, status, declineReason })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh orders list
        const query = user ? `?username=${encodeURIComponent(user.username)}&role=${encodeURIComponent(user.role)}` : '';
        const ordersRes = await fetch(`/api/orders${query}`);
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders);
        }
        showToast(`Order "${orderId}" status updated to: ${status}`, 'success');
      }
    } catch (err) {
      console.error('Failed to update order status in DB:', err);
    }
  };

  // ── Products ───────────────────────────────────────────────────────────────
  const addProduct = async (garment: Garment) => {
    const updated = [garment, ...products];
    setProducts(updated);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', product: garment }),
      });
      showToast(`Product "${garment.name}" added successfully.`, 'success');
    } catch (err) {
      console.error('Failed to save product to database:', err);
    }
  };

  const updateProduct = async (garment: Garment) => {
    const updated = products.map((p) => (p.id === garment.id ? garment : p));
    setProducts(updated);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', product: garment }),
      });
      showToast(`Product "${garment.name}" updated successfully.`, 'success');
    } catch (err) {
      console.error('Failed to update product in database:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      showToast(`Product deleted successfully.`, 'info');
    } catch (err) {
      console.error('Failed to delete product from database:', err);
    }
  };

  const updateProfile = async (details: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    gender?: 'Male' | 'Female';
    profilePicture?: string;
    credits?: number;
  }): Promise<AuthResult> => {
    if (!user) return { success: false, error: 'No active session' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, ...details }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      // Update state
      const updatedUser: UserSession = {
        ...user,
        ...details,
        credits: data.user.credits
      };
      setUser(updatedUser);

      // Sync to localStorage session
      localStorage.setItem('abstract_session', JSON.stringify(updatedUser));

      // Reload registeredUsers list
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      if (usersData.success && usersData.users) {
        setRegisteredUsers(usersData.users);
      }

      // If credits were claimed, show custom toast
      if (details.credits !== undefined && details.credits > (user.credits || 0)) {
        showToast(`Credits Claimed! New Balance: ${details.credits} Credits`, 'success');
      } else {
        showToast(`User profile updated.`, 'success');
      }

      return { success: true };
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const addReview = async (newReviewData: Omit<Review, 'id' | 'date' | 'published'>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', review: newReviewData })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh reviews list
        const reviewsRes = await fetch('/api/reviews');
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success && reviewsData.reviews) {
          setReviews(reviewsData.reviews);
        }
        showToast(`Review submitted and is awaiting administrator approval.`, 'info');
      }
    } catch (err) {
      console.error('Failed to save review in DB:', err);
    }
  };

  const toggleReviewPublish = async (reviewId: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'togglePublish', reviewId })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh reviews list
        const reviewsRes = await fetch('/api/reviews');
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success && reviewsData.reviews) {
          setReviews(reviewsData.reviews);
        }
        showToast(`Review publish status updated.`, 'success');
      }
    } catch (err) {
      console.error('Failed to toggle review status in DB:', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        cart,
        orders,
        products,
        registeredUsers,
        isCartOpen,
        genderMode,
        reviews,
        setGenderMode,
        login,
        register,
        loginWithGoogle,
        createAdminUser,
        removeAdminUser,
        logout,
        addToCart,
        removeFromCart,
        checkout,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        setCartOpen,
        updateProfile,
        addReview,
        toggleReviewPublish,
        showToast,
        trackEvent,
      }}
    >
      {children}

      {/* Global Toast Notification System Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[9999]"
          >
            <div className={`flex items-center gap-3 bg-black/85 backdrop-blur-md border px-4 py-3.5 rounded-2xl shadow-2xl font-sans text-xs tracking-wide min-w-[280px] max-w-sm ${
              toast.type === 'success' ? 'border-emerald-500/30' :
              toast.type === 'error' ? 'border-rose-500/30' : 'border-purple-500/30'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-purple-400 shrink-0" />}
              
              <div className="flex-1 flex flex-col gap-0.5">
                <span className={`font-mono text-[8px] font-bold uppercase tracking-widest ${
                  toast.type === 'success' ? 'text-emerald-400' :
                  toast.type === 'error' ? 'text-rose-400' : 'text-purple-400'
                }`}>
                  {toast.type === 'success' ? 'SYSTEM LINK ACTIVE' :
                   toast.type === 'error' ? 'TRANSACTION DECLINED' : 'TELEMETRY PROTOCOL'}
                </span>
                <span className="font-semibold text-white/95">{toast.message}</span>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all focus:outline-none shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
