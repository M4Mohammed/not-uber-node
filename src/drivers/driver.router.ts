import express from 'express';
import driverController from './driver.controller.js';
import driverValidator from './driver.validator.js';

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  driverController.findDrivers);
router.get(
  '/:id',
  driverValidator.validateFindDriverById,
  driverController.findDriverById);

export default router;