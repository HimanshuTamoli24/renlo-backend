import z from "zod";

export const userSchema = z.object({    
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),

    role: z.enum(['BIGBOSS', 'OWNER', 'TENANT']).optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),

    pancardNumber: z.string().optional(),
    aadharNumber: z.string().optional(),
    drivingLicenseNumber: z.string().optional(),
});