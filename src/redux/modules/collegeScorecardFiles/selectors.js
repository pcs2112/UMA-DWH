import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardFiles', 'dataLoaded', 'data');

/**
 * Returns the college scorecard files data from the state.
 */
export const getCollegeScorecardFilesData = createGetItemsSelector(_getData);
