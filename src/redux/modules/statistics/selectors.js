import { createSelector } from 'reselect';
import moment from 'moment';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import { DEAULT_MONTHS_SIZE, DEFAULT_DATE_FORMAT } from 'constants/index';
import {
  createDataSelector,
  createGetItemsSelector,
  createFetchingErrorSelector
} from 'helpers/selectors';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';

const emptyFilters = {
  schema: '',
  date: moment().format(DEFAULT_DATE_FORMAT),
  months: DEAULT_MONTHS_SIZE
};

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
const _getFilters = state => (objectHasOwnProperty(state.statistics, 'schema') ? {
  schema: state.statistics.schema,
  date: state.statistics.date,
  months: state.statistics.months
} : emptyFilters);

/**
 * Returns the DWH statistics from the state.
 */
export const getStatistics = createGetItemsSelector(_getData);

/**
 * Selector to get the report history filters.
 */
export const getFilters = createSelector(
  [statisticsSchemasReduxModule.selectors.getSchemas, _getFilters],
  (schemas, filtersFromState) => {
    if (schemas.length < 1) {
      return {
        schema: '',
        date: moment().format(DEFAULT_DATE_FORMAT),
        months: DEAULT_MONTHS_SIZE
      };
    }

    let { schema, date, months } = filtersFromState;

    // Set the default schema
    if (schema === '') {
      schema = schemas[0].group_schema;
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
