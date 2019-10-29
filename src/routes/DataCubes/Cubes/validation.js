import memoize from 'lru-memoize';
import { createValidator, required } from 'javascript-utils/lib/validation';
import { isEmpty } from 'javascript-utils/lib/utils';

const validateTableName = (value, data) => {
  let error = '';

  if (data && data.materialize && isEmpty(value)) {
    error = 'Required.';
  }

  return error;
};

export const cubeValidator = memoize(10)(createValidator({
  cube_name: required(),
  view_name: required(),
  table_name: validateTableName,
  cube_date_start: required(),
  definition: required(),
  'schedule.name': required()
}));

export const scheduleValidator = memoize(10)(createValidator({
  name: required()
}));
