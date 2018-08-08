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
const _getData = createDataSelector('powerbiReportRuns');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('powerbiReportRuns');

/**
 * Selector to get the Power BI report runs.
 */
export const getPowerbiReportRuns = createGetItemsSelector(_getData);

/**
 * Selector to get the pagination's current cycle group.
 */
export const getCurrentCycleGroup = createGetCurrentCycleGroup('powerbiReportRuns');

/**
 * Selector to get the pagination's current cycle group start dttm.
 */
export const getCurrentCycleGroupStartDttm = createGetCurrentCycleGroupStartDttm(getPowerbiReportRuns);

/**
 * Selector to get the pagination's prev cycle group start data.
 */
export const getPrevCycleGroupStartData = createGetPrevCycleGroupStartData(getPowerbiReportRuns, getCurrentCycleGroup);

/**
 * Selector to get the pagination's next cycle group start dttm.
 */
export const getNextCycleGroupStartData = createGetNextCycleGroupStartData(getPowerbiReportRuns, getCurrentCycleGroup);
