import { ExportJob, ImportJob, JobState, ExportJobType, ImportJobType } from '../models/Job';
import { v4 as uuidv4 } from 'uuid';

class JobService {
  private exportJobs: ExportJob[] = [];
  private importJobs: ImportJob[] = [];

  addExportJob(data: { bookId: string; type: ExportJobType }): ExportJob {
    const job: ExportJob = {
      id: uuidv4(),
      ...data,
      state: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.exportJobs.push(job);
    this.processExportJob(job);
    return job;
  }

  addImportJob(data: { bookId: string; type: ImportJobType; url: string }): ImportJob {
    const job: ImportJob = {
      id: uuidv4(),
      ...data,
      state: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.importJobs.push(job);
    this.processImportJob(job);
    return job;
  }

  getExportJobsGroupedByState() {
    return this.groupJobsByState(this.exportJobs);
  }

  getImportJobsGroupedByState() {
    return this.groupJobsByState(this.importJobs);
  }

  private groupJobsByState(jobs: (ExportJob | ImportJob)[]) {
    return jobs.reduce((acc, job) => {
      (acc[job.state] = acc[job.state] || []).push(job);
      return acc;
    }, {} as Record<JobState, (ExportJob | ImportJob)[]>);
  }

  private processExportJob(job: ExportJob) {
    const processingTimes = { epub: 10000, pdf: 25000 };
    setTimeout(() => {
      job.state = 'finished';
      job.updatedAt = new Date();
    }, processingTimes[job.type]);
  }

  private processImportJob(job: ImportJob) {
    setTimeout(() => {
      job.state = 'finished';
      job.updatedAt = new Date();
    }, 60000);
  }
}

export const jobService = new JobService();