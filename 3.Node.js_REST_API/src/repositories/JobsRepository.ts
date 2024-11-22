import { Job } from '../models/Job';

let jobs: Job[] = []; // In-memory storage

export const jobsRepository = {
  create: (job: Job) => {
    jobs.push(job);
    return job;
  },
  listByState: (type: 'export' | 'import') => {
    return jobs
      .filter((job) =>
        type === 'export'
          ? ['epub', 'pdf'].includes(job.type)
          : ['word', 'pdf', 'wattpad', 'evernote'].includes(job.type)
      )
      .reduce((grouped, job) => {
        (grouped[job.state] = grouped[job.state] || []).push(job);
        return grouped;
      }, {} as Record<string, Job[]>);
  },
  updateState: (id: string, state: 'finished') => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      job.state = state;
      job.updatedAt = new Date();
    }
  },
  clearJobs: () => {
    jobs = [];
  },
  getJobs: () => jobs,
};