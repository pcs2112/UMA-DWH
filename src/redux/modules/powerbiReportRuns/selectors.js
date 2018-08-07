import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
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
