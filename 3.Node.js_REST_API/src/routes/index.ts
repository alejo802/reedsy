import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import {
  createExportJob,
  createImportJob,
  listExportJobs,
  listImportJobs,
} from '../controllers/JobsController';
import {
  exportJobSchema,
  importJobSchema,
} from '../models/Schemas';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'OK', timestamp: new Date().toISOString() });
});

// POST /export: Validate request body using exportJobSchema
router.post(
  '/export',
  validateRequest(exportJobSchema),
  createExportJob
);

// POST /import: Validate request body using importJobSchema
router.post(
  '/import',
  validateRequest(importJobSchema),
  createImportJob
);

// GET /export: No request body to validate
router.get('/export', listExportJobs);

// GET /import: No request body to validate
router.get('/import', listImportJobs);

export default router;