import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('powerbiReportHistory');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('powerbiReportHistory');

/**
 * Selector to get the Power BI report history.
 */
export const getPowerbiReportHistory = createGetItemsSelector(_getData);
