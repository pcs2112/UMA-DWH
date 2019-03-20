import { createSelector } from 'reselect';
import { isEmpty, objectHasOwnProperty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createGetPropertySelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';
import collegeScorecardFilesReduxModule from '../collegeScorecardFiles';

const _getData = createDataSelector('collegeScorecard', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  fileName: state.collegeScorecard.fileName,
  populated: state.collegeScorecard.populated,
  query: state.collegeScorecard.query
});

const _getSelected = createGetPropertySelector('collegeScorecard', 'selected');

const _getSelectedOrder = createGetPropertySelector('collegeScorecard', 'selectedOrder');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecard', 'fetchingError', 'payload');

/**
 * Returns the college scorecard data from the state.
 */
/**
 * Returns the college scorecard data from the state.
 */
export const getCollegeScorecardData = createSelector(
  [_getFilters, _getData],
  (filters, data) => {
    const { populated } = filters;
    let result = [];

    if (populated !== 'ALL') {
      result = data;
    } else {
      result = data.filter(res => res.per_pop > 0);
    }

    if (objectHasOwnProperty(filters, 'query')
      && !isEmpty(filters.query)
      && filters.query.length >= 3) {
      const queryNormalized = filters.query.toLowerCase();
      result = result.filter((res) => {
        const normalizedColumnName = `${res.column_name}`.toLowerCase();
        const normalizedDesc = `${res.entry_name}`.toLowerCase();
        const normalizedLongDesc = `${res.entry_description}`.toLowerCase();

        return normalizedColumnName.indexOf(queryNormalized) > -1
          || normalizedDesc.indexOf(queryNormalized) > -1
          || normalizedLongDesc.indexOf(queryNormalized) > -1;
      });
    }

    return result;
  }
);

/**
 * Selector to return the selected items.
 */
export const getSelected = createGetPropertySelector('collegeScorecard', 'selected');

/**
 * Selector to return the selected items in order they were selected.
 */
export const getSelectedOrdered = createSelector(
  [_getSelected, _getSelectedOrder],
  (selected, selectedOrder) => {
    const data = [];
    selectedOrder.forEach((itemId) => {
      data.push(selected[itemId]);
    });

    return data;
  }
);

/**
 * Selector to get the total count of selected items.
 */
export const getSelectedCount = createSelector(
  [_getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the filters.
 */
export const getFilters = createSelector(
  [_getFilters, collegeScorecardFilesReduxModule.selectors.getCollegeScorecardFilesData],
  (filtersFromState, files) => {
    const { populated, query } = filtersFromState;
    let { fileName } = filtersFromState;

    // Set the default file
    if (fileName === '' && files.length > 0) {
      fileName = files[0].file_name;
    }

    return {
      fileName,
      populated,
      query
    };
  }
);

/**
 * Returns the selected ordered columns names.
 */
export const getSelectedColumnNames = createSelector(
  [getSelectedOrdered],
  (selected) => {
    const columns = [];
    selected.forEach((column) => {
      columns.push(column.column_name);
    });

    return columns;
  }
);
