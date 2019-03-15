import memoize from 'lru-memoize';
import {
  createValidator, required
} from 'javascript-utils/lib/validation';

export const newReportValidator = memoize(10)(createValidator({
  report_name: required(),
  report_descrip: required()
}));

export const existingReportValidator = memoize(10)(createValidator({
  report_name: required(),
  report_descrip: required()
}));
