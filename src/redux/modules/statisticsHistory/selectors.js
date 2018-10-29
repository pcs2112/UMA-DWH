import { createSelector } from 'reselect';
import moment from 'moment';
import { DEAULT_MONTHS_SIZE, DEFAULT_DATE_FORMAT } from 'constants/index';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';

const _getData = createDataSelector('statisticsHistory', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('statisticsHistory', 'fetchingError', 'payload');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  schema: state.statisticsHistory.schema,
  date: state.statisticsHistory.date,
  months: state.statisticsHistory.months
});

/**
 * Returns the DWH statistics history from the state.
 */
export const getStatisticsHistory = createGetItemsSelector(_getData);

/**
 * Selector to get the statistics history filters.
 */
export const getFilters = createSelector(
  [_getFilters, statisticsSchemasReduxModule.selectors.getSchemas],
  (filtersFromState, schemas) => {
    let { schema, date, months } = filtersFromState;

    // Set the default schema
    if (schema === '' && schemas.length > 0) {
      schema = schemas[0].name;
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
      schema,
      date,
      months
    };
  }
);
