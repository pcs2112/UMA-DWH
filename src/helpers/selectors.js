import { createSelector } from 'reselect';
import { CYCLE_GROUP_PAGE_SIZE } from 'constants/index';

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
