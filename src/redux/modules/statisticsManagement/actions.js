import { createPollingActions } from 'redux-polling';

export const actionTypes = {
  FETCH_BEGIN: 'statisticsManagement/FETCH_BEGIN',
  FETCH_SUCCESS: 'statisticsManagement/FETCH_SUCCESS',
  FETCH_FAIL: 'statisticsManagement/FETCH_FAIL',
  RESET: 'statisticsManagement/RESET',
  SELECT: 'statisticsManagement/SELECT',
  UNSELECT: 'statisticsManagement/UNSELECT',
  UNSELECT_ALL: 'statisticsManagement/UNSELECT_ALL',
};

/**
 * Action to fetch the ETL statistics management.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics/management')
});

/**
 * Polling action used to fetch the ETL statistics management.
 */
const polling = () => (dispatch) => {
  const promises = [dispatch(fetch())];
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to select a statistics management item.
 */
export const select = (id, data) => ({
  type: actionTypes.SELECT,
  id,
  data
});

/**
 * Action to unselect a statistics management item.
 */
export const unselect = id => ({
  type: actionTypes.UNSELECT,
  id
});

/**
 * Action to unselect all statistics management items.
 */
export const unselectAll = () => ({
  type: actionTypes.UNSELECT_ALL
});

/**
 * Create the polling actions
 */
export const pollingActions = createPollingActions('statisticsManagementPolling', polling(), 30000, 0);
