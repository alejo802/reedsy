export type JobState = 'pending' | 'finished';

export type ExportJobType = 'epub' | 'pdf';
export type ImportJobType = 'word' | 'pdf' | 'wattpad' | 'evernote';
export type JobType = ExportJobType | ImportJobType;

export interface Job {
  id: string;
  bookId: string;
  state: JobState;
  createdAt: Date;
  updatedAt: Date;
  type: JobType;
}

export interface ExportJob extends Job {
  type: ExportJobType;
}

export interface ImportJob extends Job {
  type: ImportJobType;
  url: string;
}