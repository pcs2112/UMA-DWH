import { createSelector } from 'reselect';
import moment from 'moment/moment';
import { DEFAULT_DATE_FORMAT, DEAULT_MONTHS_SIZE } from 'constants/index';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector
} from 'helpers/selectors';

const _getData = createDataSelector('tryCatchErrors');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  date: state.tryCatchErrors.date,
  months: state.tryCatchErrors.months
});

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('tryCatchErrors');

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
      date,
      months
    };
  }
);
