import { catchValidation } from '../../../../helpers/redux';
import { createSetFilterAction } from '../../../reducers/itemListFiltersReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'etlManualRuns/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlManualRuns/FETCH_SUCCESS',
  FETCH_FAIL: 'etlManualRuns/FETCH_FAIL',
  RESET: 'etlManualRuns/RESET',
  SET_FILTERS: 'etlManualRuns/SET_FILTERS',
  CLEARALL_BEGIN: 'etlManualRuns/CLEARALL_BEGIN',
  CLEARALL_SUCCESS: 'etlManualRuns/CLEARALL_SUCCESS',
  CLEARALL_FAIL: 'etlManualRuns/CLEARALL_FAIL',
  SAVE_BEGIN: 'etlManualRuns/SAVE_BEGIN',
  SAVE_SUCCESS: 'etlManualRuns/SAVE_SUCCESS',
  SAVE_FAIL: 'etlManualRuns/SAVE_FAIL',
  UPDATING_START: 'etlManualRuns/UPDATING_START',
  UPDATING_END: 'etlManualRuns/UPDATING_END'
};

/**
 * Action to load the manual runs.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/runs/manual')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to set a filter.
 */
export const setFilter = createSetFilterAction(actionTypes.SET_FILTERS, 'filters');

/**
 * Action to clear all the manual runs.
 */
export const clearAll = () => ({
  types: [
    actionTypes.CLEARALL_BEGIN,
    actionTypes.CLEARALL_SUCCESS,
    actionTypes.CLEARALL_FAIL
  ],
  makeRequest: client => client.post('/api/etl/runs/manual/clear')
});

/**
 * Action to create/update a manual run.
 *
 * @param {Object} data
 */
export const save = data => ({
  types: [
    actionTypes.SAVE_BEGIN,
    actionTypes.SAVE_SUCCESS,
    actionTypes.SAVE_FAIL
  ],
  makeRequest: client => client.post('/api/etl/runs/manual', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to mark a manual run as being updating.
 * @param {Number} id
 */
export const updatingStart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove the current manual run as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});
