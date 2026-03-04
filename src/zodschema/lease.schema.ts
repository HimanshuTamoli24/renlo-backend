import z from 'zod';

export const leaseDocumentItemSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
});

export const uploadLeaseDocumentsSchema = z.object({
  documents: z.array(leaseDocumentItemSchema).min(1),
});

export const signAgreementSchema = z.object({
  agreementSigned: z.literal(true),
});

export const confirmInventorySchema = z.object({
  inventoryConfirmed: z.literal(true),
});

export const adminUpdateLeaseStatusSchema = z.object({
  status: z.enum([
    'PENDING_DOCS',
    'AGREEMENT_PENDING',
    'INVENTORY_PENDING',
    'ACTIVE',
    'TERMINATED',
  ]),
});
