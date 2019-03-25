import {
  createDataSelector, createFetchingErrorSelector, createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { FILTERS_STATE_KEY_NAME } from './constants';

const _getData = createDataSelector('etlManagement', 'dataLoaded', 'data');

/**
 * Returns the fetching error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlManagement', 'fetchingError', 'payload');

/**
 * Returns the ETL management data from the state.
 */
export const getData = createGetItemsSelector(_getData);

/**
 * Returns the ETL management filters from the state.
 */
export const getFilters = createGetPropertySelector('etlManagement', FILTERS_STATE_KEY_NAME);
