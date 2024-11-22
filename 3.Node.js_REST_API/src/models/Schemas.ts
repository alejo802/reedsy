import { z } from 'zod';

export const exportJobSchema = z.object({
  body: z.object({
    bookId: z.string(),
    type: z.enum(['epub', 'pdf']),
  }),
});

export const importJobSchema = z.object({
  body: z.object({
    bookId: z.string(),
    type: z.enum(['word', 'pdf', 'wattpad', 'evernote']),
    url: z.string().url(),
  }),
});