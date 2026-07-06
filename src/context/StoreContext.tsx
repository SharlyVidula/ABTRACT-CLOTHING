'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Garment, GARMENTS } from '@/lib/garments';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredUser {
  username: string;
  password: string; // plain-text for demo purposes
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
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
  createAdminUser: (username: string, password: string, gender: 'Male' | 'Female') => Promise<AuthResult>;
  removeAdminUser: (username: string) => Promise<AuthResult>;
  logout: () => void;
  addToCart: (garment: Garment, size: 'S' | 'M' | 'L' | 'XL' | '2XL', quantity: number, paymentMethod: string) => void;
  removeFromCart: (index: number) => void;
  checkout: (deliveryDetails?: DeliveryDetails) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], declineReason?: string) => void;
  addProduct: (garment: Garment) => void;
  updateProduct: (garment: Garment) => void;
  deleteProduct: (id: string) => void;
  setCartOpen: (open: boolean) => void;
  updateProfile: (details: { email?: string; phone?: string; address?: string; city?: string; gender?: 'Male' | 'Female'; profilePicture?: string }) => Promise<AuthResult>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'published'>) => void;
  toggleReviewPublish: (reviewId: string) => void;
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

  // ── Hydrate from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    // Users list
    const savedUsers = localStorage.getItem('abstract_users');
    if (savedUsers) {
      const parsed: StoredUser[] = JSON.parse(savedUsers);
      setTimeout(() => setRegisteredUsers(parsed), 0);
    } else {
      setTimeout(() => setRegisteredUsers([]), 0);
      localStorage.setItem('abstract_users', JSON.stringify([]));
    }

    // Active session
    const savedSession = localStorage.getItem('abstract_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession) as UserSession;
      setUser(parsed);
      if (parsed.gender) setGenderMode(parsed.gender);
    }

    const savedCart = localStorage.getItem('abstract_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedOrders = localStorage.getItem('abstract_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedReviews = localStorage.getItem('abstract_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const initialReviews: Review[] = [
        {
          id: 'REV_1',
          orderId: 'TX_INV903',
          username: 'Seraphina',
          rating: 5,
          comment: 'The Seraphina Top fits like an absolute glove! The fabric draping is extremely high quality.',
          date: '7/5/2026 10:15 AM',
          published: true
        },
        {
          id: 'REV_2',
          orderId: 'TX_INV904',
          username: 'Lucian',
          rating: 4,
          comment: 'Impressed with the fast validation and dispatch. Blazer quality is premium.',
          date: '7/4/2026 04:30 PM',
          published: true
        }
      ];
      setReviews(initialReviews);
      localStorage.setItem('abstract_reviews', JSON.stringify(initialReviews));
    }

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products from database API:', err);
      }
    };
    loadProducts();
  }, []);

  // ── Auth helpers ───────────────────────────────────────────────────────────
  const getUsers = (): StoredUser[] => {
    const raw = localStorage.getItem('abstract_users');
    return raw ? JSON.parse(raw) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    setRegisteredUsers(users);
    localStorage.setItem('abstract_users', JSON.stringify(users));
  };

  const login = async (username: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error };
      
      const session: UserSession = { username: data.user.username, role: data.user.role, gender: data.user.gender, email: data.user.email };
      setUser(session);
      setGenderMode(data.user.gender);
      localStorage.setItem('abstract_session', JSON.stringify(session));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
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
      
      const session: UserSession = { username: data.user.username, role: data.user.role, gender: data.user.gender, email: data.user.email };
      setUser(session);
      setGenderMode(data.user.gender);
      localStorage.setItem('abstract_session', JSON.stringify(session));
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
      
      // Update local storage so UI updates instantly
      const users = getUsers();
      const newAdmin: StoredUser = { username: username.trim(), password, role: 'Admin', gender };
      saveUsers([newAdmin, ...users]);
      
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
      const users = getUsers();
      const updatedUsers = users.filter((u) => u.username !== username);
      saveUsers(updatedUsers);
      
      if (user.username === username) {
        logout();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to remove admin' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('abstract_session');
  };

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (garment: Garment, size: 'S' | 'M' | 'L' | 'XL' | '2XL', quantity: number, paymentMethod: string) => {
    const updated = [...cart, { garment, size, quantity, paymentMethod }];
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
  };

  const checkout = (deliveryDetails?: DeliveryDetails) => {
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
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('abstract_orders', JSON.stringify(updatedOrders));
    setCart([]);
    localStorage.removeItem('abstract_cart');
    setCartOpen(false);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], declineReason?: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, declineReason } : o
    );
    setOrders(updated);
    localStorage.setItem('abstract_orders', JSON.stringify(updated));
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
      };
      setUser(updatedUser);

      // Sync to localStorage session
      localStorage.setItem('abstract_session', JSON.stringify(updatedUser));

      // Sync to registeredUsers mock list in local storage
      const updatedUsers = registeredUsers.map((u) => {
        if (u.username.toLowerCase() === user.username.toLowerCase()) {
          return { ...u, ...details };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('abstract_users', JSON.stringify(updatedUsers));

      return { success: true };
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const addReview = (newReviewData: Omit<Review, 'id' | 'date' | 'published'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: 'REV_' + Math.random().toString(36).substring(3, 9).toUpperCase(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      published: false
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('abstract_reviews', JSON.stringify(updated));
  };

  const toggleReviewPublish = (reviewId: string) => {
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, published: !r.published } : r
    );
    setReviews(updated);
    localStorage.setItem('abstract_reviews', JSON.stringify(updated));
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
