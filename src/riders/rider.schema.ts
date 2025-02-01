import { z } from 'zod';

export const findRiderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createRiderSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    dateOfBirth: z.coerce.date().refine(
      (dob) => {
        const age = new Date().getFullYear() - dob.getFullYear();
        return age >= 18;
      },
      { message: 'Rider must be at least 18 years old' },
    ),
    gender: z.string(),
    city: z.string().min(2),
    state: z.string().min(2),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    nationalId: z.string().length(13),
  }),
});
