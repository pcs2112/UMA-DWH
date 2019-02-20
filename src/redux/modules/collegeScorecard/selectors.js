import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecard', 'dataLoaded', 'data');

/**
 * Returns the college scorecard data from the state.
 */
export const getCollegeScorecardData = createGetItemsSelector(_getData);
