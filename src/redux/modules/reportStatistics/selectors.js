import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('reportStatistics');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('reportStatistics');

/**
 * Selector to get the report statistics.
 */
export const getReportStatistics = createGetItemsSelector(_getData);
