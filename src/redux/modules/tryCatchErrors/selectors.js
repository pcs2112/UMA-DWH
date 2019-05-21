import { createSelector } from 'reselect';
import moment from 'moment/moment';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { DEFAULT_DATE_FORMAT, DEAULT_MONTHS_SIZE } from '../../../constants/index';
import { FILTERS_STATE_KEY_NAME } from './constants';

const _getData = createDataSelector('tryCatchErrors', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = createGetPropertySelector('tryCatchErrors', FILTERS_STATE_KEY_NAME);

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('tryCatchErrors', 'fetchingError', 'payload');

/**
 * Returns the try catch errors from the state.
 */
export const getTryCatchErrors = createGetItemsSelector(_getData);

/**
 * Selector to get the report history filters.
 */
export const getFilters = createSelector(
  [_getFilters],
  (filtersFromState) => {
    let { date, months } = filtersFromState;

    // Set the default date
    if (date === '') {
      date = moment().format(DEFAULT_DATE_FORMAT);
    }

    // Set the default months
    if (months === '') {
      months = DEAULT_MONTHS_SIZE;
    }

    return {
      ...filtersFromState,
      date,
      months
    };
  }
);
