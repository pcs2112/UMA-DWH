import { MAX_FETCH_CYCLE_GROUPS } from 'constants/index';
import { sleep, shouldFetchCycle, getNewStartCycleGroup } from 'helpers/utils';

export const actionTypes = {
  FETCH_BEGIN: 'etlCycleHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlCycleHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'etlCycleHistory/FETCH_FAIL',
  RESET: 'etlCycleHistory/RESET',
  CLEAR_FETCH_FAIL: 'etlCycleHistory/CLEAR_FETCH_FAIL',
  SELECT: 'etlCycleHistory/SELECT',
  UNSELECT: 'etlCycleHistory/UNSELECT',
  UNSELECT_ALL: 'etlCycleHistory/UNSELECT_ALL'
};

/**
 * Async action creator to fetch the ETL history.
 */
export const fetchHistory = (cycleGroup, refresh = false) => (dispatch, getState) => {
  const { etlCycleHistory } = getState();
  const { currentCycleGroup, startCycleGroup } = etlCycleHistory;
  const normalizedNewCycleGroup = typeof cycleGroup === 'undefined' ? currentCycleGroup : cycleGroup;

  // Fetch data for the new cycle group
  if (refresh || shouldFetchCycle(normalizedNewCycleGroup, startCycleGroup, MAX_FETCH_CYCLE_GROUPS)) {
    const newStartCycleGroup = getNewStartCycleGroup(
      normalizedNewCycleGroup,
      startCycleGroup,
      MAX_FETCH_CYCLE_GROUPS
    );

    const newEndCycleGroup = newStartCycleGroup + MAX_FETCH_CYCLE_GROUPS;
    return new Promise((resolve, reject) => {
      dispatch({
        types: [
          actionTypes.FETCH_BEGIN,
          actionTypes.FETCH_SUCCESS,
          actionTypes.FETCH_FAIL
        ],
        makeRequest: client => client.get('/api/etl/history', {
          params: {
            start_cycle_group: newStartCycleGroup,
            end_cycle_group: newEndCycleGroup
          }
        }),
        payload: {
          currentCycleGroup: normalizedNewCycleGroup,
          startCycleGroup: newStartCycleGroup
        }
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return new Promise((resolve, reject) => {
    // Fake FETCH_BEGIN to show loading indicator
    dispatch({
      type: actionTypes.FETCH_BEGIN
    });

    // Update current cycle group
    sleep(1000)
      .then(() => {
        dispatch({
          type: actionTypes.FETCH_SUCCESS,
          currentCycleGroup: normalizedNewCycleGroup,
          startCycleGroup
        });

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Action to fetch the previous cycle group before the current cycle group.
 */
export const fetchPrev = () => (dispatch, getState) =>
  dispatch(fetchHistory(getState().etlCycleHistory.currentCycleGroup - 1));

/**
 * Action to fetch the next cycle group after the current cycle group.
 */
export const fetchNext = () => (dispatch, getState) =>
  dispatch(fetchHistory(getState().etlCycleHistory.currentCycleGroup + 1));

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Removes the fetching error from the state.
 */
export const clearFetchingError = () => ({
  type: actionTypes.CLEAR_FETCH_FAIL
});

/**
 * Action to select a history item.
 */
export const select = (id, data) => ({
  type: actionTypes.SELECT,
  id,
  data
});

/**
 * Action to unselect a history item.
 */
export const unselect = id => ({
  type: actionTypes.UNSELECT,
  id
});

/**
 * Action to unselect all history items.
 */
export const unselectAll = () => ({
  type: actionTypes.UNSELECT_ALL
});
