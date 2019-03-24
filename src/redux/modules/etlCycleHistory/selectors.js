import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createGetCurrentCycleGroupStartDttm } from '../../../helpers/selectors';
import {
  FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

const _getData = createDataSelector('etlCycleHistory', 'dataLoaded', 'data');

const _getAllData = createDataSelector('etlCycleHistory', 'dataLoaded', 'allData');

/**
 * Return the selected order from the state.
 */
const _getSelectedOrder = createGetPropertySelector('etlCycleHistory', SELECTED_ORDER_STATE_KEY_NAME);

/**
 * Returns the ETL history from the state.
 */
export const getHistory = createGetItemsSelector(_getData);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlCycleHistory', 'fetchingError', 'payload');

/**
 * Returns the cycle history list filters.
 */
export const getFilters = createGetPropertySelector('etlCycleHistory', FILTERS_STATE_KEY_NAME);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('etlCycleHistory', SELECTED_STATE_KEY_NAME);

/**
 * Returns the start cycle group.
 */
export const getStartCycleGroup = createGetPropertySelector('etlCycleHistory', 'startCycleGroup');

/**
 * Returns the current cycle group.
 */
export const getCurrentCycleGroup = createGetPropertySelector('etlCycleHistory', 'currentCycleGroup');

/**
 * Selector to get the total count of procedures and data marts selected.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the last procedure selected.
 */
export const getLastSelected = createSelector(
  [_getSelectedOrder, getSelected],
  (selectedOrder, selected) => {
    if (selectedOrder.length < 1) {
      return undefined;
    }

    return selected[selectedOrder[selectedOrder.length - 1]];
  }
);

/**
 * Returns the ETL history by cycle group from the state.
 */
export const getHistoryByCycleGroup = createSelector(
  [_getData],
  data => data
);

/**
 * Returns the current cycle group's start dttm.
 */
export const getCurrentCycleGroupStartDttm = createGetCurrentCycleGroupStartDttm(_getAllData, 'start_dttm');

/**
 * Returns the interval duration from the state.
 */
export const getIntervalDuration = createGetPropertySelector('etlCycleHistory', 'intervalDuration');

/**
 * Returns the cycle date.
 */
export const getCycleDate = createSelector(
  [getFilters],
  filters => filters.cycleDate
);
