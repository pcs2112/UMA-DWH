import memoize from 'lru-memoize';
import { createValidator, validDate, validDateRange } from 'javascript-utils/lib/validation';
import { DEFAULT_DATE_FORMAT } from 'constants/index';

const validDateValidator = validDate(DEFAULT_DATE_FORMAT);
const validDateRangeValidator = validDateRange('start_date', DEFAULT_DATE_FORMAT);

const validator = createValidator({
  start_date: validDateValidator,
  end_date: [validDateValidator, validDateRangeValidator]
});

export default memoize(10)(validator);
