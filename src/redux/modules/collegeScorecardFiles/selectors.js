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
 * Returns the college scorecard files dropdown options.
 */
export const getCollegeScorecardFilesDropdownOptions = createSelector(
  [_getData],
  data => data.map((file) => {
    const fileName = file.file_name;
    return {
      key: fileName,
      value: fileName,
      text: fileName
    };
  })
);
