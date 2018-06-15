import { createSelector } from 'reselect';

/**
 * Creates a selector function to get the data property from a state slice.
 * @param {String} stateName State slice name
 * @returns {function(*): Array}
 */
export const createDataSelector = stateName => state => (state[stateName].dataLoaded ? state[stateName].data : []);

/**
 * Creates a selector function to return the fetching error property from a state slice.
 * @param {String} stateName State slice name
 * @returns {function(*): Boolean|Object}
 */
export const createFetchingErrorSelector = stateName => state =>
  (state[stateName].fetchingError && state[stateName].fetchingError.payload
    ? state[stateName].fetchingError.payload
    : false
  );

/**
 * Creates selector to return the value of a property in a state slice.
 * @param {String} stateName
 * @param {String} propertyName
 * @returns {function(*): *}
 */
export const createGetPropertySelector = (stateName, propertyName) => state => state[stateName][propertyName];

/**
 * Creates selector to return data.
 * @param {Function} getDataSelector
 */
export const createGetItemsSelector = getDataSelector => createSelector(
  [getDataSelector],
  data => data
);

/**
 * Creates a selector to get an item by Id.
 * @param {Function} getItemsSelector
 * @param {Function} getItemIdSelector
 */
export const createGetItemByIdSelector = (getItemsSelector, getItemIdSelector) => createSelector(
  [getItemsSelector, getItemIdSelector],
  (items, itemId) => (itemId ? items.find(item => item.id === itemId) : undefined)
);
