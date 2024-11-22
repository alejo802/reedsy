import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './middleware/logger';
import { config } from './config/config';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(express.json());
app.use(helmet()); // Secure app by setting various HTTP headers
app.use(pinoHttp({ logger })); // Log incoming requests and responses

// Log each request
app.use((req, res, next) => {
  req.log.info({ req }, 'Request received');
  next();
});

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

// Start the Server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
const setupGracefulShutdown = () => {
  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received. Shutting down gracefully.');
    process.exit(0);
  });
  process.on('SIGINT', () => {
    logger.warn('SIGINT signal received. Shutting down gracefully.');
    process.exit(0);
  });
};

setupGracefulShutdown();
startServer();

export default app;