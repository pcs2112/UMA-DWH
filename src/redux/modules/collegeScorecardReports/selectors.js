import moment from 'moment';
import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { DEFAULT_DATE_FORMAT } from '../../../constants';
import collegeScorecardReduxModule from '../collegeScorecard';

const _getData = createDataSelector('collegeScorecardReports', 'dataLoaded', 'data');

/**
 * Get the current report.
 */
export const getCurrentReport = createGetPropertySelector('collegeScorecardReports', 'current');

/**
 * Returns the college scorecard reports data from the state.
 */
export const getCollegeScorecardReportsData = createGetItemsSelector(_getData);

/**
 * Gets the initial form values for the new report form.
 */
export const getNewReportFormInitialValues = createSelector(
  [collegeScorecardReduxModule.selectors.getSelectedColumnNames],
  (userId, columns) => ({
    columns
  })
);

/**
 * Gets the initial form values for the save report form.
 */
export const getExistingReportFormInitialValues = createSelector(
  [getCurrentReport, collegeScorecardReduxModule.selectors.getSelectedColumnNames],
  (userId, currentReport, columns) => {
    const values = {
      columns
    };

    if (currentReport) {
      values.report_name = currentReport.report_name;
      values.report_descrip = currentReport.report_descrip;
      values.share_dttm = currentReport.share_dttm ? moment(currentReport.share_dttm).format(DEFAULT_DATE_FORMAT) : '';
    }

    return values;
  }
);
