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
