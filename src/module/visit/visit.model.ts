import mongoose, { Schema } from 'mongoose';

export type VisitStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'VISITED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';
export type VisitDecision = 'YES' | 'NO';

export interface IVisit {
  tenant: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  listing: mongoose.Types.ObjectId;
  requestedDate?: Date;
  scheduledDate?: Date;
  visitedAt?: Date;
  status: VisitStatus;
  decision?: VisitDecision;
  decisionAt?: Date;
  notes?: string;
  moveInIntent: boolean;
  moveInRequestedAt?: Date;
}

const visitSchema = new Schema<IVisit>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    requestedDate: { type: Date },
    scheduledDate: { type: Date },
    visitedAt: { type: Date },
    status: {
      type: String,
      enum: ['REQUESTED', 'SCHEDULED', 'VISITED', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'REQUESTED',
    },
    decision: {
      type: String,
      enum: ['YES', 'NO'],
    },
    decisionAt: { type: Date },
    notes: { type: String, trim: true },
    moveInIntent: { type: Boolean, default: false },
    moveInRequestedAt: { type: Date },
  },
  { timestamps: true },
);

const Visit = mongoose.model<IVisit>('Visit', visitSchema);

export default Visit;
