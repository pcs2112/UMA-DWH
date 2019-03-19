import { catchValidation } from '../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardReports/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardReports/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardReports/FETCH_FAIL',
  FETCH_REPORT_BEGIN: 'collegeScorecardReports/FETCH_REPORT_BEGIN',
  FETCH_REPORT_SUCCESS: 'collegeScorecardReports/FETCH_REPORT_SUCCESS',
  FETCH_REPORT_FAIL: 'collegeScorecardReports/FETCH_REPORT_FAIL',
  RESET: 'collegeScorecardReports/RESET',
  RESET_REPORT: 'collegeScorecardReports/RESET_REPORT',
  CREATE_BEGIN: 'collegeScorecardReports/CREATE_BEGIN',
  CREATE_SUCCESS: 'collegeScorecardReports/CREATE_SUCCESS',
  CREATE_FAIL: 'collegeScorecardReports/CREATE_FAIL',
  UPDATE_BEGIN: 'collegeScorecardReports/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'collegeScorecardReports/UPDATE_SUCCESS',
  UPDATE_FAIL: 'collegeScorecardReports/UPDATE_FAIL'
};

/**
 * Action to fetch the College scorecard reports.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/reports')
});

/**
 * Action to fetch a College scorecard report.
 */
export const fetchReport = id => ({
  types: [
    actionTypes.FETCH_REPORT_BEGIN,
    actionTypes.FETCH_REPORT_SUCCESS,
    actionTypes.FETCH_REPORT_FAIL
  ],
  makeRequest: client => client.get(`/api/college_scorecard/reports/${id}`),
  payload: {
    currentId: id
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Resets the current report from the state.
 */
export const resetReport = () => ({
  type: actionTypes.RESET_REPORT
});

/**
 * Action to create a new report.
 *
 * @param {Object} data
 */
export const create = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/college_scorecard/reports', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to create save an existing report.
 *
 * @param {Object} data
 */
export const update = data => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.put('/api/college_scorecard/reports', {
    data
  })
    .catch(catchValidation)
});
