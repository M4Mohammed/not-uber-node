import { z } from 'zod';
import { createDriverSchema, updateDriverSchema } from '../driver.schema.js';

export type CreateDriverDto = z.infer<typeof createDriverSchema>['body'];
export type UpdateDriverDto = z.infer<typeof updateDriverSchema>['params'] & z.infer<typeof updateDriverSchema>['body'];