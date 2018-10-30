import moment from 'moment';
import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';
import { DEAULT_MONTHS_SIZE, DEFAULT_DATE_FORMAT } from 'constants/index';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';

const _getData = createDataSelector('statisticsChart', 'dataLoaded', 'data');

/**
 * Returns the DWH statistics chart data from the state.
 */
export const getStatisticsChartData = createGetItemsSelector(_getData);

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  schema: state.statisticsChart.schema,
  date: state.statisticsChart.date,
  months: state.statisticsChart.months
});

/**
 * Selector to get the statistics chart filters.
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
