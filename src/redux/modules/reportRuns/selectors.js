import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetCurrentCycleGroup,
  createGetCurrentCycleGroupStartDttm,
  createGetPrevCycleGroupStartData,
  createGetNextCycleGroupStartData
} from 'helpers/selectors';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('reportRuns');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('reportRuns');

/**
 * Selector to get the report runs.
 */
export const getReportRuns = createGetItemsSelector(_getData);

/**
 * Selector to get the pagination's current cycle group.
 */
export const getCurrentCycleGroup = createGetCurrentCycleGroup('reportRuns');

/**
 * Selector to get the pagination's current cycle group start dttm.
 */
export const getCurrentCycleGroupStartDttm = createGetCurrentCycleGroupStartDttm(getReportRuns, 'from_dttm');

/**
 * Selector to get the pagination's prev cycle group start data.
 */
export const getPrevCycleGroupStartData = createGetPrevCycleGroupStartData(getReportRuns, getCurrentCycleGroup);

/**
 * Selector to get the pagination's next cycle group start dttm.
 */
export const getNextCycleGroupStartData = createGetNextCycleGroupStartData(getReportRuns, getCurrentCycleGroup);
