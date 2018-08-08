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

/**
 * Creates a selector to return the pagination's current cycle group.
 */
export const createGetCurrentCycleGroup = (stateName, propertyName = 'currentCycleGroup') =>
  state => state[stateName][propertyName] || 0;

/**
 * Creates a selector to return the pagination's current cycle group's start dttm.
 */
export const createGetCurrentCycleGroupStartDttm = (getItemsSelector, startDttmKey = 'start_dttm') =>
  createSelector(
    [getItemsSelector],
    data => (data.length > 0 ? data[0][startDttmKey] : 'N/A')
  );

/**
 * Returns the prev cycle group's pagination data.
 */
export const createGetPrevCycleGroupStartData = (getItemsSelector, getCurrentCycleGroupSelector, pageSize = 1000) =>
  createSelector(
    [getItemsSelector, getCurrentCycleGroupSelector],
    (data, currentCycleGroup) => {
      if (data.length < 1) {
        return {
          currentCycleGroup: 0,
          fromNum: '',
          toNum: ''
        };
      }

      const newCycleGroup = currentCycleGroup < 1 ? 0 : currentCycleGroup - 1;
      let fromNum = '';
      let toNum = '';
      if (newCycleGroup > 0) {
        fromNum = data[0].id - pageSize;
        toNum = fromNum + pageSize;
      }
      return {
        currentCycleGroup: newCycleGroup,
        fromNum,
        toNum
      };
    }
  );

/**
 * Returns the next cycle group's pagination data.
 */
export const createGetNextCycleGroupStartData = (getItemsSelector, getCurrentCycleGroupSelector, pageSize = 1000) =>
  createSelector(
    [getItemsSelector, getCurrentCycleGroupSelector],
    (data, currentCycleGroup) => {
      if (data.length < 1) {
        return {
          currentCycleGroup: 0,
          fromNum: '',
          toNum: ''
        };
      }

      const newCycleGroup = currentCycleGroup + 1;
      const fromNum = data[data.length - 1].id + pageSize;
      const toNum = fromNum + pageSize;
      return {
        currentCycleGroup: newCycleGroup,
        fromNum,
        toNum
      };
    }
  );
