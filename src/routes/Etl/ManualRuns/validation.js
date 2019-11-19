import memoize from 'lru-memoize';
import {
  createValidator, required, validDate, validDateRange
} from 'javascript-utils/lib/validation';
import { DEFAULT_DATETIME_LOCAL_FORMAT } from '../../../constants';

export const manualRunValidator = memoize(10)(createValidator({
  stored_procedure: required(),
  status: required(),
  from_dttm: [required(), validDate(DEFAULT_DATETIME_LOCAL_FORMAT)],
  to_dttm: [
    required(), validDate(DEFAULT_DATETIME_LOCAL_FORMAT), validDateRange('from_dttm', DEFAULT_DATETIME_LOCAL_FORMAT)
  ]
}));
