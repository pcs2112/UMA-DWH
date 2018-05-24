import memoize from 'lru-memoize';
import { createValidator, required, email } from 'javascript-utils/lib/validation';

const validator = createValidator({
  employee_first_name: required(),
  employee_last_name: required(),
  employee_email: [required(), email()],
  employee_phone: required(),
  employee_cell_phone: required()
});

export default memoize(10)(validator);
