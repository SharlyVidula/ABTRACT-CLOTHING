'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Garment, GARMENTS } from '@/lib/garments';

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

  // ── Hydrate Session and Cart ──────────────────────────────────────────────
  useEffect(() => {
    // Active session
    const savedSession = localStorage.getItem('abstract_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession) as UserSession;
      setUser(parsed);
      if (parsed.gender) setGenderMode(parsed.gender);
    }

    const savedCart = localStorage.getItem('abstract_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load static reviews / products from database API
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
