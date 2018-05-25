import memoize from 'lru-memoize';
import { createValidator, required, email } from 'javascript-utils/lib/validation';
import { phoneNumber } from 'helpers/validation';

export const newUserValidator = memoize(10)(createValidator({
  employee_first_name: required(),
  employee_last_name: required(),
  employee_email: [required(), email()],
  employee_phone: phoneNumber(10, 'Enter a valid phone number.'),
  employee_cell_phone: phoneNumber(10, 'Enter a valid cellphone number.'),
  employee_password: required()
}));

export const existingUserValidator = memoize(10)(createValidator({
  employee_first_name: required(),
  employee_last_name: required(),
  employee_email: [required(), email()],
  employee_phone: phoneNumber(10, 'Enter a valid phone number.'),
  employee_cell_phone: phoneNumber(10, 'Enter a valid cellphone number.')
}));
