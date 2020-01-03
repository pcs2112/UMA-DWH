import { createPollingActions } from 'redux-polling';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardTasks/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardTasks/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardTasks/FETCH_FAIL',
  RESET: 'collegeScorecardTasks/RESET',
  SCHEDULE_BEGIN: 'collegeScorecardTasks/SCHEDULE_BEGIN',
  SCHEDULE_SUCCESS: 'collegeScorecardTasks/SCHEDULE_SUCCESS',
  SCHEDULE_FAIL: 'collegeScorecardTasks/SCHEDULE_FAIL',
};

const POLLING_INTERVAL = 30000;

/**
 * Action to fetch the College scorecard tasks.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/tasks'),
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET,
});

/**
 * Action to schedule a College scorecard task.
 */
export const scheduleTask = (data) => ({
  types: [
    actionTypes.SCHEDULE_BEGIN,
    actionTypes.SCHEDULE_SUCCESS,
    actionTypes.SCHEDULE_FAIL
  ],
  makeRequest: client => client.post('/api/college_scorecard/tasks', {
    data,
  }),
});

const polling = () => (dispatch) => dispatch(fetch());

export const getPollingActions = () =>
  createPollingActions(`collegeScorecardTasksPolling_${POLLING_INTERVAL}`, polling(), POLLING_INTERVAL, 0);
