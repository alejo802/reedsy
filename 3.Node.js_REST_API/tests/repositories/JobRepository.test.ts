import { Job } from '../../src/models/Job';
import { jobsRepository } from '../../src/repositories/JobsRepository';

describe('jobsRepository', () => {
  // Reset the jobs array before each test
  beforeEach(() => {
    jobsRepository.clearJobs();
  });

  describe('create', () => {
    it('should add a job to the repository', () => {
      const job: Job = {
        id: 'job-1',
        bookId: 'book-1',
        type: 'pdf',
        state: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = jobsRepository.create(job);

      expect(result).toBe(job);
      expect(jobsRepository.getJobs()).toContain(job);
    });
  });

  describe('listByState', () => {
    beforeEach(() => {
      // Seed the repository with sample jobs
      const jobs: Job[] = [
        {
          id: 'job-1',
          bookId: 'book-1',
          type: 'pdf',
          state: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'job-2',
          bookId: 'book-2',
          type: 'epub',
          state: 'finished',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'job-3',
          bookId: 'book-3',
          type: 'word',
          state: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'job-4',
          bookId: 'book-4',
          type: 'wattpad',
          state: 'finished',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jobs.forEach((job) => jobsRepository.create(job));
    });

    it('should list import jobs grouped by state', () => {
      const result = jobsRepository.listByState('import');
    
      expect(result).toEqual({
        pending: [
          expect.objectContaining({ id: 'job-1', type: 'pdf' }),
          expect.objectContaining({ id: 'job-3', type: 'word' }),
        ],
        finished: [expect.objectContaining({ id: 'job-4', type: 'wattpad' })],
      });
    });

    it('should list import jobs grouped by state', () => {
      const result = jobsRepository.listByState('import');
    
      expect(result).toEqual({
        pending: [
          expect.objectContaining({ id: 'job-1', type: 'pdf' }),
          expect.objectContaining({ id: 'job-3', type: 'word' }),
        ],
        finished: [expect.objectContaining({ id: 'job-4', type: 'wattpad' })],
      });
    });

    it('should return empty groups if no import jobs match', () => {
      // Reset jobs and add only export jobs with type 'epub'
      jobsRepository.clearJobs();
      const exportJob: Job = {
        id: 'job-6',
        bookId: 'book-6',
        type: 'epub', // 'epub' is only in ExportJobType
        state: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jobsRepository.create(exportJob);
    
      const result = jobsRepository.listByState('import');
      expect(result).toEqual({});
    });
  });

  describe('updateState', () => {
    beforeEach(() => {
      // Seed the repository with a sample job
      const job: Job = {
        id: 'job-1',
        bookId: 'book-1',
        type: 'pdf',
        state: 'pending',
        createdAt: new Date('2024-11-22T12:00:00.000Z'),
        updatedAt: new Date('2024-11-22T12:00:00.000Z'),
      };
      jobsRepository.create(job);
    });

    it('should update the state of a job', () => {
      const beforeUpdate = jobsRepository.getJobs().find(
        (j: Job) => j.id === 'job-1'
      );
      expect(beforeUpdate).toBeDefined(); // Ensure beforeUpdate is not undefined
      expect(beforeUpdate!.state).toBe('pending');

      const beforeUpdateTime = beforeUpdate!.updatedAt;

      jobsRepository.updateState('job-1', 'finished');

      const afterUpdate = jobsRepository.getJobs().find(
        (j: Job) => j.id === 'job-1'
      );
      expect(afterUpdate).toBeDefined(); // Ensure afterUpdate is not undefined
      expect(afterUpdate!.state).toBe('finished');
      expect(afterUpdate!.updatedAt.getTime()).toBeGreaterThan(
        beforeUpdateTime.getTime()
      );
    });

    it('should do nothing if job id does not exist', () => {
      const beforeUpdate = [...jobsRepository.getJobs()];

      jobsRepository.updateState('non-existent-id', 'finished');

      const afterUpdate = [...jobsRepository.getJobs()];
      expect(afterUpdate).toEqual(beforeUpdate);
    });
  });
});