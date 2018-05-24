import { isEmpty } from './utils';

/**
 * Turns an object's keys into a query string.
 *
 * @param {object} params
 * @returns {string}
 */
export const getQueryString = (params) => {
  let str = '';
  Object.keys(params).forEach((key) => {
    if (!isEmpty(params[key])) {
      if (str !== '') {
        str += '&';
      }

      str += `${key}=${encodeURIComponent(params[key])}`;
    }
  });

  return str;
};
