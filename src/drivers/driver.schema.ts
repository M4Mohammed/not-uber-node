import { z } from 'zod';

export const findDriverByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createDriverSchema = z.object({
  body: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.date(),
    gender: z.string(),
    nationalId: z.string().length(13),
    city: z.string(),
    state: z.string(),
    phoneNumber: z.string().length(11),
    password: z.string(),
    licenseNumber: z.string(),
  }),
});

export const updateDriverSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.date(),
    phoneNumber: z.string().length(11),
  }),
});
