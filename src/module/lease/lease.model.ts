import mongoose, { Schema } from 'mongoose';

export type LeaseStatus =
  | 'PENDING_DOCS'
  | 'AGREEMENT_PENDING'
  | 'INVENTORY_PENDING'
  | 'ACTIVE'
  | 'TERMINATED';

export interface ILeaseDocumentItem {
  name: string;
  url: string;
}

export interface ILease {
  tenant: mongoose.Types.ObjectId;
  listing: mongoose.Types.ObjectId;
  visit: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  documents: ILeaseDocumentItem[];
  agreementSigned: boolean;
  inventoryConfirmed: boolean;
  status: LeaseStatus;
}

const leaseDocumentSchema = new Schema<ILeaseDocumentItem>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const leaseSchema = new Schema<ILease>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    visit: { type: Schema.Types.ObjectId, ref: 'Visit', required: true, unique: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
    documents: { type: [leaseDocumentSchema], default: [] },
    agreementSigned: { type: Boolean, default: false },
    inventoryConfirmed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['PENDING_DOCS', 'AGREEMENT_PENDING', 'INVENTORY_PENDING', 'ACTIVE', 'TERMINATED'],
      default: 'PENDING_DOCS',
      index: true,
    },
  },
  { timestamps: true },
);

leaseSchema.index({ tenant: 1, listing: 1, status: 1 });

const Lease = mongoose.model<ILease>('Lease', leaseSchema);

export default Lease;
