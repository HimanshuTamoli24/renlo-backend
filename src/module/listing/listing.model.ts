import mongoose, { Schema } from 'mongoose';

export type ListingStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';

export interface IListing {
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  amenities: string[];
  rules: string[];
  availableFrom: Date;
  status: ListingStatus;
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
    availableFrom: { type: Date, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'REVIEW', 'PUBLISHED'],
      default: 'DRAFT',
    },
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
