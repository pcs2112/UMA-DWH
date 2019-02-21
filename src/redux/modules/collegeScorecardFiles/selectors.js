import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardFiles', 'dataLoaded', 'data');

/**
 * Returns the college scorecard files data from the state.
 */
export const getCollegeScorecardFilesData = createGetItemsSelector(_getData);

/**
 * Returns the options used in the multi dropdown in the scorecard page.
 */
export const getFilterOptions = createSelector(
  [getCollegeScorecardFilesData],
  (data) => {
    if (data.length < 1) {
      return [];
    }

    return data.map(item => ({
      key: item.file_name,
      value: item.file_name,
      text: item.file_name
    }));
  }
);
