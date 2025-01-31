import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import riderController from './rider.controller.js';
import { createRiderSchema, findRiderByIdSchema, updateRiderSchema } from './rider.schema.js';

const router = express.Router();

router.get('/', riderController.findRiders);

router.get('/:id', validate(findRiderByIdSchema), riderController.findRiderById);

router.post('/', validate(createRiderSchema), riderController.createRider);

router.patch('/:id', validate(updateRiderSchema), riderController.updateRider);

router.delete('/:id', validate(findRiderByIdSchema), riderController.deleteRider);

export default router;
