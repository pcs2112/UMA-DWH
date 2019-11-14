import memoize from 'lru-memoize';
import { createValidator, required } from 'javascript-utils/lib/validation';

export const manualRunValidator = memoize(10)(createValidator({
  stored_procedure: required(),
  status: required(),
  from_dttm: required(),
  to_dttm: required()
}));
