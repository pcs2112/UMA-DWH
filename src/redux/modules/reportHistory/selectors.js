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
const _getData = createDataSelector('reportHistory');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => (objectHasOwnProperty(state.reportHistory, 'startDate') ? {
  start_date: state.reportHistory.startDate,
  end_date: state.reportHistory.endDate
} : emptyFilters);

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('reportHistory');

/**
 * Selector to get the report history.
 */
export const getReportHistory = createGetItemsSelector(_getData);

/**
 * Selector to get the report history filters.
 */
export const getFilters = createSelector(
  [_getFilters],
  filtersFromState => filtersFromState
);
