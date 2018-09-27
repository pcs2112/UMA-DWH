import { createSelector } from 'reselect';
import moment from 'moment';
import { DEAULT_MONTHS_SIZE, DEFAULT_DATE_FORMAT } from 'constants/index';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector
} from 'helpers/selectors';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';

const _getData = createDataSelector('statistics');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('statistics');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  schema: state.statistics.schema,
  date: state.statistics.date,
  months: state.statistics.months
});

/**
 * Returns the DWH statistics from the state.
 */
export const getStatistics = createGetItemsSelector(_getData);

/**
 * Selector to get the report history filters.
 */
export const getFilters = createSelector(
  [_getFilters, statisticsSchemasReduxModule.selectors.getSchemas],
  (filtersFromState, schemas) => {
    let { schema, date, months } = filtersFromState;

    // Set the default schema
    if (schema === '' && schemas.length > 0) {
      schema = schemas[0].target_schema_name;
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
