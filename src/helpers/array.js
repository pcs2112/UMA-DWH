/**
 * Finds the index of an item in a list.
 *
 * @param {Array} list
 * @param {String|Number} value
 * @param {String} key
 */
export const findItemIndexByValue = (list, value, key = 'id') => list.findIndex(item => item[key] === value);
