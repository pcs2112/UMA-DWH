import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardReports', 'dataLoaded', 'data');

/**
 * Returns the college scorecard reports data from the state.
 */
export const getCollegeScorecardReportsData = createGetItemsSelector(_getData);
