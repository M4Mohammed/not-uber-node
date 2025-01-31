import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import logger from './utils/logger.js';
import helmet from 'helmet';
import { getReasonPhrase } from 'http-status-codes';
import driverRouter from './drivers/driver.router.js';
import errorHandler from './middlewares/error.handler.js';
import riderRouter from './riders/rider.router.js';

dotenv.config();
const app = express();

app.use(
  morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res));
    const message = `${tokens.method(req, res)} - ${tokens.url(req, res)} - ${getReasonPhrase(status)} (${status}) - ${tokens['response-time'](req, res)}ms`;
    if (status >= 400 && status < 500) {
      logger.warn(message);
    } else if (status >= 500) {
      logger.error(message);
    } else {
      logger.http(message);
    }
    return null;
  }),
);

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/drivers', driverRouter);
app.use('/api/v1/riders', riderRouter);
app.use('/api/v1/auth');

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => logger.info(`Server is running on port ${port}`));
