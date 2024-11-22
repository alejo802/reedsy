export const validateCreateExportJobRequest = (body: any): string[] => {
  const errors: string[] = [];
  const { bookId, type } = body;

  if (!bookId) {
    errors.push('bookId is required');
  }

  if (!type) {
    errors.push('type is required');
  } else if (!['epub', 'pdf'].includes(type)) {
    errors.push('type must be one of: epub, pdf');
  }

  return errors;
};

export const validateCreateImportJobRequest = (body: any): string[] => {
  const errors: string[] = [];
  const { bookId, type, url } = body;

  if (!bookId) {
    errors.push('bookId is required');
  }

  if (!url) {
    errors.push('url is required');
  }

  if (!type) {
    errors.push('type is required');
  } else if (!['word', 'pdf', 'wattpad', 'evernote'].includes(type)) {
    errors.push('type must be one of: word, pdf, wattpad, evernote');
  }

  return errors;
};