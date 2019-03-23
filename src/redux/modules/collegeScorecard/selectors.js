import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetPropertySelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';
import collegeScorecardFilesRdx from '../collegeScorecardFiles';
import {
  FILTERS_STATE_KEY_NAME,
  SELECTED_STATE_KEY_NAME,
  SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

const _getData = createDataSelector('collegeScorecard', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => state.collegeScorecard[FILTERS_STATE_KEY_NAME];

const _getSelected = createGetPropertySelector('collegeScorecard', SELECTED_STATE_KEY_NAME);

const _getSelectedOrder = createGetPropertySelector('collegeScorecard', SELECTED_ORDER_STATE_KEY_NAME);

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
  [_getData],
  data => data
);

/**
 * Selector to return the selected items.
 */
export const getSelected = createGetPropertySelector('collegeScorecard', SELECTED_STATE_KEY_NAME);

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
  [_getFilters, collegeScorecardFilesRdx.selectors.getCollegeScorecardFilesData],
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
