import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'BIGBOSS' | 'OWNER' | 'TENANT';

  address?: string;
  phone?: string;
  country?: string;
  city?: string;
  postalCode?: string;

  pancardNumber?: string;
  aadharNumber?: string;
  drivingLicenseNumber?: string;

  refreshToken?: string;
  refreshTokenExpiry?: Date;
}

interface UserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

interface UserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, UserModel, UserDocument>(
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
    city: { type: String },
    postalCode: { type: String },

    pancardNumber: { type: String },
    aadharNumber: { type: String },
    drivingLicenseNumber: { type: String },

    refreshToken: { type: String, select: false },
    refreshTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function (password: string) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
