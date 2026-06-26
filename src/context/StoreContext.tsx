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
  size: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
  paymentMethod: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: string;
  user: string;
  email?: string;
  status: 'Pending Approval' | 'Pending Delivery' | 'Dispatched' | 'Discarded';
  declineReason?: string;
}

export interface UserSession {
  username: string;
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
}

export type AuthResult = { success: boolean; error?: string };

// ─── Default seed admin (always present) ─────────────────────────────────────
const DEFAULT_ADMIN: StoredUser = {
  username: 'admin',
  password: 'admin123',
  role: 'Admin',
  gender: 'Male',
};

// ─── Context Shape ────────────────────────────────────────────────────────────
interface StoreContextType {
  user: UserSession | null;
  cart: CartItem[];
  orders: Order[];
  products: Garment[];
  registeredUsers: StoredUser[];
  isCartOpen: boolean;
  genderMode: 'Male' | 'Female';
  setGenderMode: (gender: 'Male' | 'Female') => void;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string, gender: 'Male' | 'Female', email?: string) => Promise<AuthResult>;
  createAdminUser: (username: string, password: string, gender: 'Male' | 'Female') => Promise<AuthResult>;
  removeAdminUser: (username: string) => Promise<AuthResult>;
  logout: () => void;
  addToCart: (garment: Garment, size: 'S' | 'M' | 'L' | 'XL', quantity: number, paymentMethod: string) => void;
  removeFromCart: (index: number) => void;
  checkout: () => void;
  updateOrderStatus: (orderId: string, status: Order['status'], declineReason?: string) => void;
  addProduct: (garment: Garment) => void;
  setCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Garment[]>(GARMENTS);
  const [isCartOpen, setCartOpen] = useState(false);
  const [genderMode, setGenderMode] = useState<'Male' | 'Female'>('Female');
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>([DEFAULT_ADMIN]);

  // ── Hydrate from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    // Users list — always ensure default admin exists
    const savedUsers = localStorage.getItem('abstract_users');
    if (savedUsers) {
      const parsed: StoredUser[] = JSON.parse(savedUsers);
      const hasAdmin = parsed.some((u) => u.username === DEFAULT_ADMIN.username);
      const finalUsers = hasAdmin ? parsed : [DEFAULT_ADMIN, ...parsed];
      setTimeout(() => setRegisteredUsers(finalUsers), 0);
      if (!hasAdmin) localStorage.setItem('abstract_users', JSON.stringify(finalUsers));
    } else {
      const initial = [DEFAULT_ADMIN];
      setTimeout(() => setRegisteredUsers(initial), 0);
      localStorage.setItem('abstract_users', JSON.stringify(initial));
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

    const savedProducts = localStorage.getItem('abstract_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  // ── Auth helpers ───────────────────────────────────────────────────────────
  const getUsers = (): StoredUser[] => {
    const raw = localStorage.getItem('abstract_users');
    return raw ? JSON.parse(raw) : [DEFAULT_ADMIN];
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
    if (username === DEFAULT_ADMIN.username) {
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
  const addToCart = (garment: Garment, size: 'S' | 'M' | 'L' | 'XL', quantity: number, paymentMethod: string) => {
    const updated = [...cart, { garment, size, quantity, paymentMethod }];
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('abstract_cart', JSON.stringify(updated));
  };

  const checkout = () => {
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
  const addProduct = (garment: Garment) => {
    const updated = [garment, ...products];
    setProducts(updated);
    localStorage.setItem('abstract_products', JSON.stringify(updated));
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
        setCartOpen,
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
