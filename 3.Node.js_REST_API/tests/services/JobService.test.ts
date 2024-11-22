import { jobService } from '../../src/services/JobsService';
import { ExportJobType, ImportJobType, JobState } from '../../src/models/Job';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('JobService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset the job arrays in jobService
    (jobService as any).exportJobs = [];
    (jobService as any).importJobs = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('addExportJob', () => {
    it('should add an export job and process it', () => {
      // Mock uuidv4 to return a predictable ID
      (uuidv4 as jest.Mock).mockReturnValue('export-job-1');

      const jobData = { bookId: 'book-123', type: 'epub' as ExportJobType };
      const job = jobService.addExportJob(jobData);

      expect(job).toEqual({
        id: 'export-job-1',
        bookId: 'book-123',
        type: 'epub',
        state: 'pending',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Verify that the job is added to exportJobs
      expect((jobService as any).exportJobs).toContainEqual(job);

      // Fast-forward time to simulate job processing
      jest.advanceTimersByTime(10000);

      // Verify that the job state is updated to 'finished'
      expect(job.state).toBe('finished');
      expect(job.updatedAt.getTime()).toBeGreaterThan(job.createdAt.getTime());
    });
  });

  describe('addImportJob', () => {
    it('should add an import job and process it', () => {
      (uuidv4 as jest.Mock).mockReturnValue('import-job-1');

      const jobData = {
        bookId: 'book-456',
        type: 'pdf' as ImportJobType,
        url: 'https://example.com/file.pdf',
      };
      const job = jobService.addImportJob(jobData);

      expect(job).toEqual({
        id: 'import-job-1',
        bookId: 'book-456',
        type: 'pdf',
        url: 'https://example.com/file.pdf',
        state: 'pending',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Verify that the job is added to importJobs
      expect((jobService as any).importJobs).toContainEqual(job);

      // Fast-forward time to simulate job processing
      jest.advanceTimersByTime(60000);

      // Verify that the job state is updated to 'finished'
      expect(job.state).toBe('finished');
      expect(job.updatedAt.getTime()).toBeGreaterThan(job.createdAt.getTime());
    });
  });

  describe('getExportJobsGroupedByState', () => {
    it('should return export jobs grouped by state', () => {
      // Mock uuidv4 to return different IDs
      (uuidv4 as jest.Mock).mockReturnValueOnce('export-job-1');
      jobService.addExportJob({ bookId: 'book-123', type: 'epub' });
      (uuidv4 as jest.Mock).mockReturnValueOnce('export-job-2');
      jobService.addExportJob({ bookId: 'book-456', type: 'pdf' });

      // Fast-forward time so that the first job is finished, second is still pending
      jest.advanceTimersByTime(10000); // First job (epub) finishes after 10,000ms

      const jobsByState = jobService.getExportJobsGroupedByState();

      expect(jobsByState).toEqual({
        pending: [
          expect.objectContaining({
            id: 'export-job-2',
            state: 'pending',
          }),
        ],
        finished: [
          expect.objectContaining({
            id: 'export-job-1',
            state: 'finished',
          }),
        ],
      });
    });
  });

  describe('getImportJobsGroupedByState', () => {
    it('should return import jobs grouped by state', () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce('import-job-1');
      jobService.addImportJob({
        bookId: 'book-123',
        type: 'word',
        url: 'https://example.com/file.docx',
      });
      (uuidv4 as jest.Mock).mockReturnValueOnce('import-job-2');
      jobService.addImportJob({
        bookId: 'book-456',
        type: 'evernote',
        url: 'https://example.com/note',
      });

      // Fast-forward time so that no job is finished yet
      jest.advanceTimersByTime(30000); // 30,000ms

      let jobsByState = jobService.getImportJobsGroupedByState();

      expect(jobsByState).toEqual({
        pending: [
          expect.objectContaining({
            id: 'import-job-1',
            state: 'pending',
          }),
          expect.objectContaining({
            id: 'import-job-2',
            state: 'pending',
          }),
        ],
      });

      // Fast-forward time to complete the jobs
      jest.advanceTimersByTime(30000); // Total 60,000ms

      jobsByState = jobService.getImportJobsGroupedByState();

      expect(jobsByState).toEqual({
        finished: [
          expect.objectContaining({
            id: 'import-job-1',
            state: 'finished',
          }),
          expect.objectContaining({
            id: 'import-job-2',
            state: 'finished',
          }),
        ],
      });
    });
  });
});