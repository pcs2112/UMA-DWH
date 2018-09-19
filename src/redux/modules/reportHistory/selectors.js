import { createSelector } from 'reselect';
import moment from 'moment';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import { DEFAULT_DATE_FORMAT, DEAULT_MONTHS_SIZE } from 'constants/index';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';
import reportsReduxModule from 'redux/modules/reports';

const emptyFilters = {
  reportName: '',
  date: moment().format(DEFAULT_DATE_FORMAT),
  months: DEAULT_MONTHS_SIZE
};

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('reportHistory');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => (objectHasOwnProperty(state.reportHistory, 'reportName') ? {
  reportName: state.reportHistory.reportName,
  date: state.reportHistory.date,
  months: state.reportHistory.months
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
  [reportsReduxModule.selectors.getReports, _getFilters],
  (reports, filtersFromState) => {
    if (reports.length < 1) {
      return {
        reportName: '',
        date: moment().format(DEFAULT_DATE_FORMAT),
        months: DEAULT_MONTHS_SIZE
      };
    }

    let { reportName, date, months } = filtersFromState;

    // Set the default report name
    if (reportName === '') {
      reportName = reports[0].calling_proc;
    }

    // Set the default date
    if (date === '') {
      date = moment().format(DEFAULT_DATE_FORMAT);
    }

    // Set the default months
    if (months === '') {
      months = DEAULT_MONTHS_SIZE;
    }

    return {
      reportName,
      date,
      months
    };
  }
);
