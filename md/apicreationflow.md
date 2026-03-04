import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'BIGBOSS' | 'OWNER' | 'TENANT';
  address?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  adharNumber?: string;
  panNumber?: string;
  drivingLicenseNumber?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ['BIGBOSS', 'OWNER', 'TENANT'],
      default: 'TENANT',
    },

    address: { type: String },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },

    adharNumber: { type: String },
    panNumber: { type: String },
    drivingLicenseNumber: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;