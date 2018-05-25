/**
 * Finds the index of an object in a list. -1 is
 * returned if the object is not found.
 *
 * @param {Array<Object>} list
 * @param {String|Number} value
 * @param {String} key
 * @returns {Number}
 */
export const findObjIndexByValue = (list, value, key = 'id') => list.findIndex(item => item[key] === value);

/**
 * Replaces an object in a list and returns the new list.
 *
 * @param {Array<Object>} list
 * @param {Object} item
 * @param {String|Number} value
 * @param {String} key
 * @returns {undefined|Array<Object>}
 */
export const replaceObjByValue = (list, item, value, key = 'id') => {
  const index = findObjIndexByValue(list, value, key);
  if (index < 0) {
    return [...list];
  }

  const newList = [...list];
  newList[index] = item;

  return newList;
};
