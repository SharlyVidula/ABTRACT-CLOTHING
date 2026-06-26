import mongoose, { Schema, Document } from 'mongoose';

// ─── User Model ─────────────────────────────────────────────────────────────
export interface IUser extends Document {
  username: string;
  password?: string; // Stored as a bcrypt hash
  email?: string;
  role: 'Customer' | 'Admin';
  gender: 'Male' | 'Female';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, trim: true },
  role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Additional schemas like Order, CustomInquiry, Product can be added here
// as the migration continues to other entities.
