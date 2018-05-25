import { isEmpty } from 'javascript-utils/lib/utils';
import { isNumber } from 'javascript-utils/lib/number';

const defaultMessages = {
  phoneNumber: 'Enter a valid phone number.'
};

/**
 * Validate a phone number.
 *
 * @param {Number} length
 * @param {String} msg
 */
export const phoneNumber = (length = 10, msg) => (value) => {
  let error = '';

  const normalizedValue = `${value}`;
  if (!isEmpty(normalizedValue) && (!isNumber(normalizedValue) || normalizedValue.length !== length)) {
    error = (msg || defaultMessages.phoneNumber).replace('{length}', `${length}`);
  }

  return error;
};
