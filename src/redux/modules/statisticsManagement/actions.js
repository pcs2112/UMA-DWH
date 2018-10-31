import { createPollingActions } from 'redux-polling';
import { STATISTICS_MANAGEMENT_REFRESH_TIMEOUT } from 'constants/index';

export const actionTypes = {
  FETCH_BEGIN: 'statisticsManagement/FETCH_BEGIN',
  FETCH_SUCCESS: 'statisticsManagement/FETCH_SUCCESS',
  FETCH_FAIL: 'statisticsManagement/FETCH_FAIL',
  RESET: 'statisticsManagement/RESET',
  SELECT: 'statisticsManagement/SELECT',
  UNSELECT: 'statisticsManagement/UNSELECT',
  SELECT_ALL: 'statisticsManagement/SELECT_ALL',
  UNSELECT_ALL: 'statisticsManagement/UNSELECT_ALL',
  QUEUE_STATS_BEGIN: 'statisticsManagement/QUEUE_STATS_BEGIN',
  QUEUE_STATS_SUCCESS: 'statisticsManagement/QUEUE_STATS_SUCCESS',
  QUEUE_STATS_FAIL: 'statisticsManagement/QUEUE_STATS_FAIL',
  DEQUEUE_STATS_BEGIN: 'statisticsManagement/DEQUEUE_STATS_BEGIN',
  DEQUEUE_STATS_SUCCESS: 'statisticsManagement/DEQUEUE_STATS_SUCCESS',
  DEQUEUE_STATS_FAIL: 'statisticsManagement/DEQUEUE_STATS_FAIL'
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
 * Action to select all statistics management items.
 */
export const selectAll = (key, data) => ({
  type: actionTypes.SELECT_ALL,
  key,
  data
});

/**
 * Action to unselect all statistics management items.
 */
export const unselectAll = () => ({
  type: actionTypes.UNSELECT_ALL
});

/**
 * Create the polling actions.
 */
export const pollingActions = createPollingActions(
  'statisticsManagementPolling', polling(), STATISTICS_MANAGEMENT_REFRESH_TIMEOUT, 0
);

/**
 * Action to queue the stats.
 */
export const queueStats = data => ({
  types: [
    actionTypes.QUEUE_STATS_BEGIN,
    actionTypes.QUEUE_STATS_SUCCESS,
    actionTypes.QUEUE_STATS_FAIL
  ],
  makeRequest: client => client.post('/api/etl/statistics/queue_stats', {
    data: {
      tables: data
    }
  }),
  payload: {
    data
  }
});

/**
 * Action to dequeue the stats.
 */
export const dequeueStats = data => ({
  types: [
    actionTypes.DEQUEUE_STATS_BEGIN,
    actionTypes.DEQUEUE_STATS_SUCCESS,
    actionTypes.DEQUEUE_STATS_FAIL
  ],
  makeRequest: client => client.post('/api/etl/statistics/dequeue_stats', {
    data: {
      tables: data
    }
  }),
  payload: {
    data
  }
});
