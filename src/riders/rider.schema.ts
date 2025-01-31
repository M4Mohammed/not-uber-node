import { z } from 'zod';

export const findRiderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createRiderSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.date(),
    gender: z.string(),
    nationalId: z.string().length(13),
    phoneNumber: z.string().length(11),
  }),
});

export const updateRiderSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.date(),
    phoneNumber: z.string().length(11),
  }),
});
