import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector,
  createGetPropertySelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';
import collegeScorecardFilesRdx from '../collegeScorecardFiles';
import {
  FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME
} from './constants';

const _getData = createDataSelector('collegeScorecardGroups', 'dataLoaded', 'data');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => state.collegeScorecardGroups[FILTERS_STATE_KEY_NAME];

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecardGroups', 'fetchingError', 'payload');

/**
 * Returns the college scorecard groups data from the state.
 */
export const getCollegeScorecardGroupsData = createGetItemsSelector(_getData);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('collegeScorecardGroups', SELECTED_STATE_KEY_NAME);

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
  [_getFilters, collegeScorecardFilesRdx.selectors.getCollegeScorecardFilesData],
  (filtersFromState, files) => {
    const { group } = filtersFromState;
    let { fileName } = filtersFromState;

    // Set the default file
    if (fileName === '' && files.length > 0) {
      fileName = files[0].file_name;
    }

    return {
      fileName,
      group
    };
  }
);
