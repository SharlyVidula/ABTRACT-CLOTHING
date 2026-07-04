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
