import { z } from 'zod';
import { validate } from '../middlewares/validation.middleware.js';

class DriverValidator {

  findDriverByIdSchema = z.object({
    params: z.object({
      id: z.string(),
    }),
  });


  validateFindDriverById = validate(this.findDriverByIdSchema);
}

export default new DriverValidator();