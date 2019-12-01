import memoize from 'lru-memoize';
import { createValidator, required } from 'javascript-utils/lib/validation';
import { isEmpty } from 'javascript-utils/lib/utils';

const validateTableName = (value, data) => {
  let error = '';

  if (data && data.materalize && isEmpty(value)) {
    error = 'Required.';
  }

  return error;
};

const validateFrequency = (value, data) => {
  let error = '';

  if (data) {
    if (isEmpty(value)) {
      error = 'Required.';
    } else if (value === 'weekly') {
      let daysSelected = 0;
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach((day) => {
        if (data[day]) {
          daysSelected++;
        }
      });

      if (daysSelected < 1) {
        error = 'At least one day is required.';
      }
    }
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
  name: required(),
  frequency: validateFrequency,
  duration_start: required()
}));
