import { createSelector } from 'reselect';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';

const emptyFilters = {
  start_date: '',
  end_date: ''
};

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('powerbiReportHistory');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => (objectHasOwnProperty(state.powerbiReportHistory, 'startDate') ? {
  start_date: state.powerbiReportHistory.startDate,
  end_date: state.powerbiReportHistory.endDate
} : emptyFilters);

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('powerbiReportHistory');

/**
 * Selector to get the Power BI report history.
 */
export const getPowerbiReportHistory = createGetItemsSelector(_getData);

/**
 * Selector to get the Power BI report history filters.
 */
export const getFilters = createSelector(
  [_getFilters],
  (filtersFromState) => {
    console.log(filtersFromState);
    return filtersFromState;
  }
);
