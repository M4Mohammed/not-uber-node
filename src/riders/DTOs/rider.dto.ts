import { z } from 'zod';
import { createRiderSchema } from '../rider.schema.js';

export type CreateRiderDto = z.infer<typeof createRiderSchema>['body'];
