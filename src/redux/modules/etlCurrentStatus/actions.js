import { CURRENT_STATUS_INTERAL_DURATION } from 'constants/index';

export const actionTypes = {
  FETCH_BEGIN: 'etlCurrentStatus/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlCurrentStatus/FETCH_SUCCESS',
  FETCH_FAIL: 'etlCurrentStatus/FETCH_FAIL',
  RESET: 'etlCurrentStatus/RESET',
  SET_INTERVAL_DURATION: 'etlCurrentStatus/SET_INTERVAL_DURATION'
};

/**
 * Action to fetch the ETL current status.
 */
export const fetchCurrentStatus = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/status')
});

/**
 * Sets the interval duration
 * @param {Number} intervalDuration
 */
export const setIntervalDuration = (intervalDuration = CURRENT_STATUS_INTERAL_DURATION) => ({
  type: actionTypes.SET_INTERVAL_DURATION,
  intervalDuration
});
