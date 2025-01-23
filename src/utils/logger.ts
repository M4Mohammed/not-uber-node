import winston from 'winston';

// Define custom log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

// Set up winston color configuration
winston.addColors(colors);

// Create format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// Determine log level based on environment
const level = () => {
  const env = process.env.NODE_ENV ?? 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export default logger;