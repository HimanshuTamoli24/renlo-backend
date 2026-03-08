import z from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  rentAmount: z.number().nonnegative(),
  amenities: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  coverImage: z.string().url().or(z.string().optional()),
  availableFrom: z.coerce.date(),
  status: z.enum(['DRAFT', 'APPROVED', 'REJECTED']).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const updateListingStatusSchema = z.object({
  status: z.enum(['DRAFT', 'APPROVED', 'REJECTED']),
});
