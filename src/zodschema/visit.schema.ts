import z from 'zod';

export const createVisitSchema = z.object({
  listingId: z.string().min(1),
  requestedDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export const scheduleVisitSchema = z.object({
  scheduledDate: z.coerce.date(),
  notes: z.string().max(500).optional(),
});

export const visitDecisionSchema = z.object({
  decision: z.enum(['YES', 'NO']),
  notes: z.string().max(500).optional(),
});

export const cancelVisitSchema = z.object({
  notes: z.string().max(500).optional(),
});
