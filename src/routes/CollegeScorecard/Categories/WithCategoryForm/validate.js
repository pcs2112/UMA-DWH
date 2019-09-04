import memoize from 'lru-memoize';
import {
  createValidator, required
} from 'javascript-utils/lib/validation';

export const newCategoryValidator = memoize(10)(createValidator({
  category_name: required(),
  description: required(),
  csv_file: required(),
  where_unit_id_table: required(),
  formula: required()
}));

export const existingCategoryValidator = memoize(10)(createValidator({
  category_name: required(),
  description: required(),
  csv_file: required(),
  where_unit_id_table: required(),
  formula: required()
}));
