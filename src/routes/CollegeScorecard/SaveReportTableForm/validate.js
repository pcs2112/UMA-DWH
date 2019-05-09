import memoize from 'lru-memoize';
import {
  createValidator
} from 'javascript-utils/lib/validation';
import { isEmpty } from 'javascript-utils/src/utils';

export const tableName = (value) => {
  let error = '';

  if (isEmpty(value)) {
    error = 'Required.';
  } else if (value.indexOf('[') > -1 || value.indexOf(']') > -1) {
    error = 'Replace [NEW_TABLE_NAME] with a new table name.';
  }

  return error;
};

export const newReportTableValidator = memoize(10)(createValidator({
  table_name: [tableName]
}));
