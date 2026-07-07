import mongoose, { Schema, Document } from 'mongoose';

// ─── User Model ─────────────────────────────────────────────────────────────
export interface IUser extends Document {
  username: string;
  password?: string; // Stored as a bcrypt hash
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
  phone?: string;
  address?: string;
  city?: string;
  profilePicture?: string;
  credits: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, trim: true },
  role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  profilePicture: { type: String },
  credits: { type: Number, default: 15000 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ─── Product Model ──────────────────────────────────────────────────────────
const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number },
  description: { type: String, required: true },
  technicalDetails: [{ type: String }],
  sizes: {
    S: { chest: Number, waist: Number, hips: Number, height: Number, inseam: Number },
    M: { chest: Number, waist: Number, hips: Number, height: Number, inseam: Number },
    L: { chest: Number, waist: Number, hips: Number, height: Number, inseam: Number },
    XL: { chest: Number, waist: Number, hips: Number, height: Number, inseam: Number },
    '2XL': { chest: Number, waist: Number, hips: Number, height: Number, inseam: Number },
  },
  inventory: {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    '2XL': { type: Number, default: 0 },
  },
  colorTheme: {
    primary: String,
    secondary: String,
    glow: String,
    glowRgb: String,
  },
  visualStyle: {
    type: { type: String }, // 'type' is a reserved mongoose word
    primaryColor: String,
    accentColor: String,
    glowingLines: Boolean,
  },
  gender: { type: String, required: true },
  brand: String,
  image: { type: String, required: true },
  images: [{ type: String }],
  video: String,
  disabledSizes: [{ type: String }],
  categoryName: String,
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// ─── Order Model ────────────────────────────────────────────────────────────
export interface IOrder extends Document {
  id: string; // unique order transaction ID
  items: any[];
  total: number;
  paymentMethod: string;
  date: string;
  user: string; // username
  email?: string;
  status: 'Pending Approval' | 'Pending Delivery' | 'Dispatched' | 'Discarded' | 'Completed';
  declineReason?: string;
  deliveryDetails?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  items: { type: Schema.Types.Mixed, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: String, required: true },
  email: { type: String },
  status: {
    type: String,
    enum: ['Pending Approval', 'Pending Delivery', 'Dispatched', 'Discarded', 'Completed'],
    default: 'Pending Approval',
  },
  declineReason: { type: String },
  deliveryDetails: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// ─── Review Model ───────────────────────────────────────────────────────────
export interface IReview extends Document {
  id: string;
  orderId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  published: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

// ─── Custom Design Inquiry Model ─────────────────────────────────────────────
export interface ICustomInquiry extends Document {
  id: string;
  name: string;
  contact: string;
  garmentType: string;
  description: string;
  budget: string;
  colorPreference: string;
  referenceImage?: string;
  referenceImageName?: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  declineReason?: string;
  createdAt: Date;
}

const CustomInquirySchema = new Schema<ICustomInquiry>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  garmentType: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: String, required: true },
  colorPreference: { type: String, required: true },
  referenceImage: { type: String },
  referenceImageName: { type: String },
  submittedAt: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  declineReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const CustomInquiry = mongoose.models.CustomInquiry || mongoose.model<ICustomInquiry>('CustomInquiry', CustomInquirySchema);
