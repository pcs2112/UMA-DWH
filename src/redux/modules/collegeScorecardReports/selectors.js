import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';
import collegeScorecardReduxModule from '../collegeScorecard';

const _getData = createDataSelector('collegeScorecardReports', 'dataLoaded', 'data');

const _getUserId = state => state.user.id;

/**
 * Returns the college scorecard reports data from the state.
 */
export const getCollegeScorecardReportsData = createGetItemsSelector(_getData);

/**
 * Gets the initial form values for the new report form.
 */
export const getNewReportFormInitialValues = createSelector(
  [_getUserId, collegeScorecardReduxModule.selectors.getSelectedColumnNames],
  (userId, columns) => ({
    user_id: userId,
    columns
  })
);
