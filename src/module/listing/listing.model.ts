import mongoose, { Schema } from 'mongoose';

export type ListingStatus = 'DRAFT'  | 'APPROVED' | 'REJECTED';

export interface IListing {
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  amenities: string[];
  rules: string[];
  images: string[];
  coverImage: string;
  availableFrom: Date;
  status: ListingStatus;
  rejectionReason?: string;
  createdBy: mongoose.Types.ObjectId;
}

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rentAmount: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: [] },
    rules: { type: [String], default: [] },
    images: { type: [String], default: [] },
    coverImage: { type: String },
    availableFrom: { type: Date, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'REJECTED'],
      default: 'DRAFT',
    },
    rejectionReason: { type: String, trim: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Listing = mongoose.model<IListing>('Listing', listingSchema);

export default Listing;
