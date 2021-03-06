import { createSelector } from 'reselect';
import moment from 'moment';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';
import { DEFAULT_DATE_FORMAT, DEAULT_MONTHS_SIZE } from 'constants/index';
import reportsReduxModule from 'redux/modules/reports';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('reportHistory', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  reportName: state.reportHistory.reportName,
  date: state.reportHistory.date,
  months: state.reportHistory.months
});

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('reportHistory', 'fetchingError', 'payload');

/**
 * Selector to get the report history.
 */
export const getReportHistory = createGetItemsSelector(_getData);

/**
 * Selector to get the report history filters.
 */
export const getFilters = createSelector(
  [_getFilters, reportsReduxModule.selectors.getReports],
  (filtersFromState, reports) => {
    let { reportName, date, months } = filtersFromState;

    // Set the default date
    if (date === '') {
      date = moment().format(DEFAULT_DATE_FORMAT);
    }

    // Set the default months
    if (months === '') {
      months = DEAULT_MONTHS_SIZE;
    }

    // Set the default report name
    if (reportName === '' && reports.length > 0) {
      reportName = reports[0].calling_proc;
    }

    return {
      reportName,
      date,
      months
    };
  }
);
