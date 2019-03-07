import { createSelector } from 'reselect';
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
  populated: state.collegeScorecard.populated
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
  (filtersFromState, data) => {
    const { populated } = filtersFromState;
    if (populated === 'ALL') {
      return data;
    }

    return data.filter(item => item.per_pop > 0);
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
    const { populated } = filtersFromState;
    let { fileName } = filtersFromState;

    // Set the default file
    if (fileName === '' && files.length > 0) {
      fileName = files[0].file_name;
    }

    return {
      fileName,
      populated
    };
  }
);

/**
 * Returns the selected columns names.
 */
export const getSelectedColumnNames = createSelector(
  [_getSelected],
  (selected) => {
    const keys = Object.keys(selected);
    if (keys.length < 1) {
      return [];
    }

    const columns = [];
    keys.forEach((key) => {
      columns.push(selected[key].column_name);
    });

    return columns;
  }
);
