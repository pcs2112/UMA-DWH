import { createPollingActions } from 'redux-polling';
import { sleep, isEmpty } from 'javascript-utils/lib/utils';
import {
  createSelectAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../reducers/itemListSelectReducerFor';
import { FILTERS_STATE_KEY_NAME } from './constants';
import { createSetFilterAction } from '../../reducers/itemListFiltersReducerFor';
import { MAX_FETCH_CYCLE_GROUPS, CURRENT_STATUS_INTERAL_DURATION } from '../../../constants/index';
import { shouldFetchCycle, getNewStartCycleGroup } from '../../../helpers/utils';
import { getStartCycleGroup, getCurrentCycleGroup, getCycleDate } from './selectors';
import etlCurrentStatusRdx from '../etlCurrentStatus';

export const actionTypes = {
  FETCH_BEGIN: 'etlCycleHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlCycleHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'etlCycleHistory/FETCH_FAIL',
  RESET: 'etlCycleHistory/RESET',
  CLEAR_FETCH_FAIL: 'etlCycleHistory/CLEAR_FETCH_FAIL',
  SELECT: 'etlCycleHistory/SELECT',
  UNSELECT: 'etlCycleHistory/UNSELECT',
  UNSELECT_ALL: 'etlCycleHistory/UNSELECT_ALL',
  SET_FILTERS: 'etlCycleHistory/SET_FILTERS',
  SET_INTERVAL_DURATION: 'etlCycleHistory/SET_INTERVAL_DURATION'
};

const polling = () => (dispatch, getState) => {
  const state = getState();
  const { etlCycleHistory: { dataLoaded } } = state;
  const startCycleGroup = getStartCycleGroup(state);
  const currentCycleGroup = getCurrentCycleGroup(state);
  const cycleDate = getCycleDate(state);

  const promises = [];

  // Fetch current status
  promises.push(dispatch(etlCurrentStatusRdx.actions.fetchCurrentStatus()));

  // Fetch the ETL Cycle history
  if (!dataLoaded || (currentCycleGroup < 1 && isEmpty(cycleDate))) {
    const newStartCycleGroup = getNewStartCycleGroup(
      currentCycleGroup,
      startCycleGroup,
      MAX_FETCH_CYCLE_GROUPS
    );

    const newEndCycleGroup = newStartCycleGroup + MAX_FETCH_CYCLE_GROUPS;
    promises.push(dispatch({
      types: [
        actionTypes.FETCH_BEGIN,
        actionTypes.FETCH_SUCCESS,
        actionTypes.FETCH_FAIL
      ],
      makeRequest: client => client.get('/api/etl/history', {
        params: {
          start_cycle_group: newStartCycleGroup,
          end_cycle_group: newEndCycleGroup,
          date: cycleDate
        }
      }),
      payload: {
        currentCycleGroup,
        startCycleGroup: newStartCycleGroup,
        cycleDate
      }
    }));
  }

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
 * Async action creator to fetch the ETL history.
 */
export const fetchHistory = (cycleGroup, cycleDate = '', refresh = false) => (dispatch, getState) => {
  const state = getState();
  const startCycleGroup = getStartCycleGroup(state);
  const currentCycleGroup = getCurrentCycleGroup(state);
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
            end_cycle_group: newEndCycleGroup,
            date: cycleDate
          }
        }),
        payload: {
          currentCycleGroup: normalizedNewCycleGroup,
          startCycleGroup: newStartCycleGroup,
          cycleDate
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
          startCycleGroup,
          cycleDate
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
export const fetchPrev = () => (dispatch, getState) => {
  const state = getState();
  const currentCycleGroup = getCurrentCycleGroup(state);
  const cycleDate = getCycleDate(state);
  return dispatch(fetchHistory(currentCycleGroup - 1, cycleDate));
};

/**
 * Action to fetch the next cycle group after the current cycle group.
 */
export const fetchNext = () => (dispatch, getState) => {
  const state = getState();
  const currentCycleGroup = getCurrentCycleGroup(state);
  const cycleDate = getCycleDate(state);
  dispatch(fetchHistory(currentCycleGroup + 1, cycleDate));
};

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to select a history item.
 */
export const select = createSelectAction(actionTypes.SELECT);

/**
 * Action to unselect a history item.
 */
export const unselect = createUnselectAction(actionTypes.UNSELECT);

/**
 * Action to unselect all history items.
 */
export const unselectAll = createUnselectAllAction(actionTypes.UNSELECT_ALL);

/**
 * Action to set a list filters.
 */
export const setFilters = createSetFilterAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);

/**
 * Sets the interval duration
 * @param {Number} intervalDuration
 */
export const setIntervalDuration = (intervalDuration = CURRENT_STATUS_INTERAL_DURATION) => ({
  type: actionTypes.SET_INTERVAL_DURATION,
  intervalDuration
});

/**
 * Returns the polling actions.
 * @param {Number} interval
 */
export const getPollingActions = interval =>
  createPollingActions(`etlCycleHistoryPolling_${interval}`, polling(), interval, 0);
