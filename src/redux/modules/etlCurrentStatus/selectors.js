import { createSelector } from 'reselect';

const emptyData = [];
const emptyDataTotals = {};
const getData = state => (state.etlCurrentStatus.dataLoaded ? state.etlCurrentStatus.data : emptyData);

/**
 * Returns the ETL current status from the state.
 */
export const currentStatus = createSelector(
  [getData],
  data => (data.length > 0 ? data.slice(0, data.length - 1) : data)
);

/**
 * Returns the ETL current status totals.
 */
export const currentStatusTotals = createSelector(
  [getData],
  data => (data.length > 0 ? data[data.length - 1] : emptyDataTotals)
);

/**
 * Returns the interval duration from the state.
 */
export const getIntervalDuration = state => state.etlCurrentStatus.intervalDuration;
