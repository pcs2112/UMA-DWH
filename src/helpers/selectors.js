import { createSelector } from 'reselect';
import { CYCLE_GROUP_PAGE_SIZE } from 'constants/index';

/**
 * Creates a selector function to get the data property from a state slice.
 *
 * @param {String} stateName State slice name
 */
export const createDataSelector = stateName => state => (state[stateName].dataLoaded ? state[stateName].data : []);

/**
 * Creates a selector function to return the fetching error property from a state slice.
 *
 * @param {String} stateName State slice name
 */
export const createFetchingErrorSelector = stateName => state =>
  (state[stateName].fetchingError && state[stateName].fetchingError.payload
    ? state[stateName].fetchingError.payload
    : false
  );

/**
 * Creates selector to return the value of a property in a state slice.
 *
 * @param {String} stateName
 * @param {String} propertyName
 */
export const createGetPropertySelector = (stateName, propertyName) => state => state[stateName][propertyName];

/**
 * Creates selector to return data.
 *
 * @param {Function} getDataSelector
 */
export const createGetItemsSelector = getDataSelector => createSelector(
  [getDataSelector],
  data => data
);

/**
 * Creates a selector to get an item by Id.
 *
 * @param {Function} getItemsSelector
 * @param {Function} getItemIdSelector
 */
export const createGetItemByIdSelector = (getItemsSelector, getItemIdSelector) => createSelector(
  [getItemsSelector, getItemIdSelector],
  (items, itemId) => (itemId ? items.find(item => item.id === itemId) : undefined)
);

/**
 * Creates a selector to return the pagination's current cycle group.
 *
 * @param {String} stateName
 * @param {String} propertyName
 */
export const createGetCurrentCycleGroup = (stateName, propertyName = 'currentCycleGroup') =>
  state => state[stateName][propertyName] || 0;

/**
 * Creates a selector to return the pagination's current cycle group's start dttm.
 *
 * @param {Function} getItemsSelector
 * @param {String} startDttmKey
 */
export const createGetCurrentCycleGroupStartDttm = (getItemsSelector, startDttmKey = 'start_dttm') =>
  createSelector(
    [getItemsSelector],
    data => (data.length > 0 ? data[0][startDttmKey] : 'N/A')
  );

/**
 * Creates a selector to return the prev cycle group's pagination data.
 *
 * @param {Function} getItemsSelector
 * @param {Function} getCurrentCycleGroupSelector
 * @param {Number} pageSize
 */
export const createGetPrevCycleGroupStartData = (
  getItemsSelector,
  getCurrentCycleGroupSelector,
  pageSize = CYCLE_GROUP_PAGE_SIZE
) =>
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
 * Creates a selector to return the next cycle group's pagination data.
 *
 * @param {Function} getItemsSelector
 * @param {Function} getCurrentCycleGroupSelector
 * @param {Number} pageSize
 */
export const createGetNextCycleGroupStartData = (
  getItemsSelector,
  getCurrentCycleGroupSelector,
  pageSize = CYCLE_GROUP_PAGE_SIZE
) =>
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
