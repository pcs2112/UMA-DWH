import memoize from 'lru-memoize';
import {
  createValidator, required, email, validPassword, numericLength
} from 'javascript-utils/lib/validation';

const phoneNumberValidator = numericLength(10, 'Please enter a valid phone number.', true);

export const newUserValidator = memoize(10)(createValidator({
  employee_first_name: required(),
  employee_last_name: required(),
  employee_email: email(),
  employee_phone: phoneNumberValidator,
  employee_cell_phone: phoneNumberValidator,
  employee_password: validPassword(1, 1, 8)
}));

export const existingUserValidator = memoize(10)(createValidator({
  employee_first_name: required(),
  employee_last_name: required(),
  employee_email: email(),
  employee_phone: phoneNumberValidator,
  employee_cell_phone: phoneNumberValidator,
  employee_password: validPassword(1, 1, 8, undefined, true)
}));
