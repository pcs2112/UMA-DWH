import memoize from 'lru-memoize';
import {
  createValidator, required
} from 'javascript-utils/lib/validation';

export const newReportTableValidator = memoize(10)(createValidator({
  table_name: required(),
  table_schema: required()
}));
