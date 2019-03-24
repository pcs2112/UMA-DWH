import { createSelector } from 'reselect';
import { createDataSelector, createGetPropertySelector } from 'javascript-utils/lib/selectors';
import { SELECTED_STATE_KEY_NAME } from './constants';

const emptyDataTotals = {};

const _getData = createDataSelector('etlCurrentStatus', 'dataLoaded', 'data');

const _getSelected = createGetPropertySelector('etlCurrentStatus', SELECTED_STATE_KEY_NAME);

/**
 * Returns the ETL current status from the state.
 */
export const getCurrentStatus = createSelector(
  [_getData],
  data => (data.length > 0 ? data.slice(0, data.length - 1) : data)
);

/**
 * Returns the ETL current status totals.
 */
export const getCurrentStatusTotals = createSelector(
  [_getData],
  data => (data.length > 0 ? data[data.length - 1] : emptyDataTotals)
);

/**
 * Returns the current ETL status.
 */
export const getCurrentEtlStatus = createSelector(
  [_getData],
  (data) => {
    if (!data || data.length < 1) {
      return 'RUNNING';
    }

    return data[data.length - 1].data_mart_status;
  }
);

/**
 * Selector to get the total count of data marts selected.
 */
export const getSelectedCount = createSelector(
  [_getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the data marts selected.
 */
export const getSelected = createSelector(
  [_getSelected],
  selected => selected
);
