import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetPropertySelector
} from 'helpers/selectors';

const emptyDataTotals = {};

const _getData = createDataSelector('etlCurrentStatus');

/**
 * Returns the ETL current status from the state.
 */
export const getCurrentStatus = createSelector(
  [_getData],
  data => (data.length > 5 ? data.slice(0, data.length - 1) : data)
);

/**
 * Returns the ETL current status totals.
 */
export const getCurrentStatusTotals = createSelector(
  [_getData],
  data => (data.length > 5 ? data[data.length - 1] : emptyDataTotals)
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

    if (data.length < 6) {
      return 'RUNNING';
    }

    return data[data.length - 1].data_mart_status;
  }
);

/**
 * Returns the interval duration from the state.
 */
export const getIntervalDuration = createGetPropertySelector('etlCurrentStatus', 'intervalDuration');
