import { z } from 'zod';
import { createRiderSchema, updateRiderSchema } from '../rider.schema.js';

export type CreateRiderDto = z.infer<typeof createRiderSchema>['body'];
export type UpdateRiderDto = z.infer<typeof updateRiderSchema>['params'] & z.infer<typeof updateRiderSchema>['body'];
