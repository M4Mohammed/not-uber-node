import { z } from 'zod';
import { loginSchema } from '../auth.schema.js';

export type LoginDto = z.infer<typeof loginSchema>['body'];
