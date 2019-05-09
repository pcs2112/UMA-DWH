import moment from 'moment';
import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { DEFAULT_DATE_FORMAT } from '../../../constants';
import collegeScorecardRdx from '../collegeScorecard';

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
 * Returns the college scorecard reports dropdown options.
 */
export const getCollegeScorecardReportsDropdownOptions = createSelector(
  [_getData],
  data => data.map(report => ({
    key: report.id,
    value: report.id,
    text: report.report_name
  }))
);

/**
 * Gets the initial form values for the new report form.
 */
export const getNewReportFormInitialValues = createSelector(
  [collegeScorecardRdx.selectors.getSelectedColumnNames],
  columns => ({
    columns,
    share_dttm: ''
  })
);

/**
 * Gets the initial form values for the save report form.
 */
export const getExistingReportFormInitialValues = createSelector(
  [getCurrentReport, collegeScorecardRdx.selectors.getSelectedColumnNames],
  (currentReport, columns) => {
    const values = {
      columns,
      share_dttm: ''
    };

    if (currentReport) {
      values.report_name = currentReport.report_name;
      values.report_descrip = currentReport.report_descrip;
      values.share_dttm = currentReport.share_dttm ? moment(currentReport.share_dttm).format(DEFAULT_DATE_FORMAT) : '';
    }

    return values;
  }
);

/**
 * Gets the initial form values for the save report to table form.
 */
export const getNewSaveReportTableFormInitialValues = createSelector(
  [getCurrentReport, collegeScorecardRdx.selectors.getSelectedFile],
  (currentReport, filename) => {
    const newFileName = filename.split('.').slice(0, -1).join('.');
    const values = {
      overwrite: false,
      table_schema: 'COLLEGE_SC',
      filename,
      table_name: `[NEW_TABLE_NAME]_${newFileName}`
    };

    if (currentReport) {
      values.report_id = currentReport.id;
    }

    return values;
  }
);
