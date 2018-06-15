import memoize from 'lru-memoize';
import { createValidator, required } from 'javascript-utils/lib/validation';

const requiredValidator = required();

export const newFileValidator = memoize(10)(createValidator({
  file_path_filename: requiredValidator,
  description: requiredValidator
}));

export const existingFileValidator = memoize(10)(createValidator({
  file_path_filename: requiredValidator,
  description: requiredValidator
}));
