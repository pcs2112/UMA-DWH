import moment from 'moment';
import {
  createDataSelector,
  createGetItemsSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect';
import { DEAULT_MONTHS_SIZE, DEFAULT_DATE_FORMAT } from '../../../constants/index';
import statisticsSchemasReduxModule from '../statisticsSchemas';
import { FILTERS_STATE_KEY_NAME } from './constants';

const _getData = createDataSelector('statisticsChart', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = createGetPropertySelector('statisticsChart', FILTERS_STATE_KEY_NAME);

/**
 * Returns the DWH statistics chart data from the state.
 */
export const getStatisticsChartData = createGetItemsSelector(_getData);

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
