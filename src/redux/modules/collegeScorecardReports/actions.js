import { catchValidation } from '../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardReports/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardReports/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardReports/FETCH_FAIL',
  RESET: 'collegeScorecardReports/RESET',
  CREATE_BEGIN: 'collegeScorecardReports/CREATE_BEGIN',
  CREATE_SUCCESS: 'collegeScorecardReports/CREATE_SUCCESS',
  CREATE_FAIL: 'collegeScorecardReports/CREATE_FAIL'
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
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
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
