import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../middleware/logger';
import { jobService } from '../services/JobsService';
import {
  validateCreateExportJobRequest,
  validateCreateImportJobRequest,
} from '../validators/JobValidator';

export const createExportJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  try {
    logger.info('Received create export job request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    // Input validation
    const validationErrors = validateCreateExportJobRequest(req.body);
    if (validationErrors.length > 0) {
      logger.warn('Invalid create export job data', {
        requestId,
        errors: validationErrors,
      });
      return res.status(400).json({ errors: validationErrors });
    }

    // Exclude sensitive fields before logging if any
    const { ...safeBody } = req.body;
    logger.debug('Create export job data', {
      requestId,
      body: safeBody,
    });

    const job = await jobService.addExportJob(req.body);

    const processingTime = Date.now() - requestStartTime;
    logger.info('Export job created successfully', {
      requestId,
      processingTime: `${processingTime}ms`,
    });

    res.status(201).json(job);
  } catch (error) {
    logger.error('Error creating export job', {
      requestId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error);
  }
};

export const createImportJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  try {
    logger.info('Received create import job request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    // Input validation
    const validationErrors = validateCreateImportJobRequest(req.body);
    if (validationErrors.length > 0) {
      logger.warn('Invalid create import job data', {
        requestId,
        errors: validationErrors,
      });
      return res.status(400).json({ errors: validationErrors });
    }

    // Exclude sensitive fields before logging
    const { url, ...safeBody } = req.body;
    logger.debug('Create import job data', {
      requestId,
      body: safeBody,
    });

    const job = await jobService.addImportJob(req.body);

    const processingTime = Date.now() - requestStartTime;
    logger.info('Import job created successfully', {
      requestId,
      processingTime: `${processingTime}ms`,
    });

    res.status(201).json(job);
  } catch (error) {
    logger.error('Error creating import job', {
      requestId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error);
  }
};

export const listExportJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  try {
    logger.info('Received request to list export jobs', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    const jobs = await jobService.getExportJobsGroupedByState();

    const processingTime = Date.now() - requestStartTime;
    logger.info('Export jobs listed successfully', {
      requestId,
      processingTime: `${processingTime}ms`,
    });

    res.status(200).json(jobs);
  } catch (error) {
    logger.error('Error listing export jobs', {
      requestId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error);
  }
};

export const listImportJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  try {
    logger.info('Received request to list import jobs', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    const jobs = await jobService.getImportJobsGroupedByState();

    const processingTime = Date.now() - requestStartTime;
    logger.info('Import jobs listed successfully', {
      requestId,
      processingTime: `${processingTime}ms`,
    });

    res.status(200).json(jobs);
  } catch (error) {
    logger.error('Error listing import jobs', {
      requestId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error);
  }
};