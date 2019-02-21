import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector,
  createGetPropertySelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';
import collegeScorecardFilesReduxModule from 'redux/modules/collegeScorecardFiles';

const _getData = createDataSelector('collegeScorecard', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => ({
  fileName: state.collegeScorecard.fileName
});

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecard', 'fetchingError', 'payload');

/**
 * Returns the college scorecard data from the state.
 */
export const getCollegeScorecardData = createGetItemsSelector(_getData);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('collegeScorecard', 'selected');

/**
 * Selector to get the total count of selected items.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the filters.
 */
export const getFilters = createSelector(
  [_getFilters, collegeScorecardFilesReduxModule.selectors.getCollegeScorecardFilesData],
  (filtersFromState, files) => {
    let { fileName } = filtersFromState;

    // Set the default file
    if (fileName === '' && files.length > 0) {
      fileName = files[0].file_name;
    }

    return {
      fileName
    };
  }
);