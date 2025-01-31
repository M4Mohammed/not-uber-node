import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema } from './auth.schema.js';
import authController from './auth.controller.js';

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);

export default router;
