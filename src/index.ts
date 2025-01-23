import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import logger from './utils/logger';
import helmet from 'helmet';
import { getReasonPhrase } from 'http-status-codes';

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
app.use(urlencoded({ extended: true }));

const port = process.env.PORT ?? 3000;
app.listen(port, () => logger.info(`Server is running on port ${port}`));

