import memoize from 'lru-memoize';
import {
  createValidator, required
} from 'javascript-utils/lib/validation';

export const newEntryValidator = memoize(10)(createValidator({
  primary_source: required(),
  data_type: required(),
  data_range: required(),
  data_format: required(),
  file: required(),
  url: required(),
  file_location: required(),
  data_lake_table: required()
}));

export const existingEntryValidator = memoize(10)(createValidator({
  entry_id: required(),
  primary_source: required(),
  data_type: required(),
  data_range: required(),
  data_format: required(),
  file: required(),
  url: required(),
  file_location: required(),
  data_lake_table: required()
}));
