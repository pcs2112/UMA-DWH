import memoize from 'lru-memoize';
import { createValidator, required } from 'javascript-utils/lib/validation';

export const cubeValidator = memoize(10)(createValidator({
  cube_name: required(),
  primary_fact_table: required(),
  view_name: required(),
  table_name: required(),
  cube_date_start: required(),
  cube_date_end: required(),
  definition: required()
}));
