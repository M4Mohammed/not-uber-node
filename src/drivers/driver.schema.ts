import { z } from 'zod';

export const findDriverByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createDriverSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    dateOfBirth: z.date().refine(
      (dob) => {
        const age = new Date().getFullYear() - dob.getFullYear();
        return age >= 21;
      },
      { message: 'Driver must be at least 21 years old' },
    ),
    gender: z.string(),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    city: z.string().min(2),
    state: z.string().min(2),
    nationalId: z.string().length(13),
    licenseNumber: z.string().regex(/^[A-Z0-9]{8,15}$/),
    userType: z.string(),
  }),
});
