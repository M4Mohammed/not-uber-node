import express from 'express';
import driverController from './driver.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createDriverSchema, findDriverByIdSchema } from './driver.schema.js';
import auth from '../middlewares/auth.js';
import { UserType } from '@prisma/client';

const router = express.Router();

router.get('/', driverController.findDrivers);

router.get('/:id', validate(findDriverByIdSchema), driverController.findDriverById);

router.post('/', validate(createDriverSchema), driverController.createDriver);

router.delete('/:id', validate(findDriverByIdSchema), driverController.deleteDriver);

export default router;
