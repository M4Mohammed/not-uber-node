import { z } from 'zod';
import { createDriverSchema } from '../driver.schema.js';

export type CreateDriverDto = z.infer<typeof createDriverSchema>['body'];
