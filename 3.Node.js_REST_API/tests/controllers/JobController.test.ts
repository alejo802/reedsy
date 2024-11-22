import { Request, Response, NextFunction } from 'express';
import {
  createExportJob,
  createImportJob,
  listExportJobs,
  listImportJobs,
} from '../../src/controllers/JobsController';
import { jobService } from '../../src/services/JobsService';
import logger from '../../src/middleware/logger';
import {
  validateCreateExportJobRequest,
  validateCreateImportJobRequest,
} from '../../src/validators/JobValidator';

// Mock dependencies
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-request-id'),
}));

jest.mock('../../src/services/JobsService', () => ({
  jobService: {
    addExportJob: jest.fn(),
    addImportJob: jest.fn(),
    getExportJobsGroupedByState: jest.fn(),
    getImportJobsGroupedByState: jest.fn(),
  },
}));

jest.mock('../../src/middleware/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../../src/validators/JobValidator', () => ({
  validateCreateExportJobRequest: jest.fn(),
  validateCreateImportJobRequest: jest.fn(),
}));

describe('Job Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      method: 'POST',
      originalUrl: '/api/export',
      ip: '127.0.0.1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createExportJob', () => {
    it('should create an export job successfully', async () => {
      req.body = { bookId: 'book-123', type: 'pdf' };
      (validateCreateExportJobRequest as jest.Mock).mockReturnValue([]);
      (jobService.addExportJob as jest.Mock).mockResolvedValue({
        id: 'job-456',
        bookId: 'book-123',
        type: 'pdf',
        state: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createExportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(validateCreateExportJobRequest).toHaveBeenCalledWith(req.body);
      expect(jobService.addExportJob).toHaveBeenCalledWith(req.body);
      expect(logger.info).toHaveBeenCalledWith(
        'Export job created successfully',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'job-456',
        bookId: 'book-123',
        type: 'pdf',
        state: 'pending',
      }));
    });

    it('should handle validation errors', async () => {
      req.body = { bookId: '', type: 'invalid-type' };
      (validateCreateExportJobRequest as jest.Mock).mockReturnValue([
        'Invalid bookId',
        'Invalid type',
      ]);

      await createExportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(validateCreateExportJobRequest).toHaveBeenCalledWith(req.body);
      expect(logger.warn).toHaveBeenCalledWith(
        'Invalid create export job data',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid bookId', 'Invalid type'],
      });
    });

    it('should handle service errors', async () => {
      req.body = { bookId: 'book-123', type: 'pdf' };
      (validateCreateExportJobRequest as jest.Mock).mockReturnValue([]);
      const error = new Error('Service failure');
      (jobService.addExportJob as jest.Mock).mockRejectedValue(error);

      await createExportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating export job',
        expect.any(Object)
      );
    });
  });

  describe('createImportJob', () => {
    it('should create an import job successfully', async () => {
      req.body = {
        bookId: 'book-456',
        type: 'word',
        url: 'https://example.com/doc.docx',
      };
      (validateCreateImportJobRequest as jest.Mock).mockReturnValue([]);
      (jobService.addImportJob as jest.Mock).mockResolvedValue({
        id: 'job-789',
        bookId: 'book-456',
        type: 'word',
        url: 'https://example.com/doc.docx',
        state: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createImportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(validateCreateImportJobRequest).toHaveBeenCalledWith(req.body);
      expect(jobService.addImportJob).toHaveBeenCalledWith(req.body);
      expect(logger.info).toHaveBeenCalledWith(
        'Import job created successfully',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'job-789',
        bookId: 'book-456',
        type: 'word',
        state: 'pending',
      }));
    });

    it('should handle validation errors', async () => {
      req.body = { bookId: '', type: 'invalid-type', url: '' };
      (validateCreateImportJobRequest as jest.Mock).mockReturnValue([
        'Invalid bookId',
        'Invalid type',
        'Invalid URL',
      ]);

      await createImportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(validateCreateImportJobRequest).toHaveBeenCalledWith(req.body);
      expect(logger.warn).toHaveBeenCalledWith(
        'Invalid create import job data',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid bookId', 'Invalid type', 'Invalid URL'],
      });
    });

    it('should handle service errors', async () => {
      req.body = {
        bookId: 'book-456',
        type: 'word',
        url: 'https://example.com/doc.docx',
      };
      (validateCreateImportJobRequest as jest.Mock).mockReturnValue([]);
      const error = new Error('Service failure');
      (jobService.addImportJob as jest.Mock).mockRejectedValue(error);

      await createImportJob(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating import job',
        expect.any(Object)
      );
    });
  });

  describe('listExportJobs', () => {
    it('should list export jobs successfully', async () => {
      req.method = 'GET';
      req.originalUrl = '/api/export';
      (jobService.getExportJobsGroupedByState as jest.Mock).mockResolvedValue({
        pending: [],
        finished: [],
      });

      await listExportJobs(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(jobService.getExportJobsGroupedByState).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Export jobs listed successfully',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        pending: [],
        finished: [],
      });
    });

    it('should handle service errors', async () => {
      req.method = 'GET';
      req.originalUrl = '/api/export';
      const error = new Error('Service failure');
      (jobService.getExportJobsGroupedByState as jest.Mock).mockRejectedValue(
        error
      );

      await listExportJobs(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error listing export jobs',
        expect.any(Object)
      );
    });
  });

  describe('listImportJobs', () => {
    it('should list import jobs successfully', async () => {
      req.method = 'GET';
      req.originalUrl = '/api/import';
      (jobService.getImportJobsGroupedByState as jest.Mock).mockResolvedValue({
        pending: [],
        finished: [],
      });

      await listImportJobs(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(jobService.getImportJobsGroupedByState).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Import jobs listed successfully',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        pending: [],
        finished: [],
      });
    });

    it('should handle service errors', async () => {
      req.method = 'GET';
      req.originalUrl = '/api/import';
      const error = new Error('Service failure');
      (jobService.getImportJobsGroupedByState as jest.Mock).mockRejectedValue(
        error
      );

      await listImportJobs(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error listing import jobs',
        expect.any(Object)
      );
    });
  });
});