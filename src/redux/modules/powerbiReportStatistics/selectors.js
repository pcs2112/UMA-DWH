import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('powerbiReportStatistics');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('powerbiReportStatistics');

/**
 * Selector to get the Power BI report statistics.
 */
export const getPowerbiReportStatistics = createGetItemsSelector(_getData);
