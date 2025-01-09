import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }),
  ],
});

export default logger;
