import { catchValidation } from '../../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubes/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubes/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubes/FETCH_FAIL',
  RESET: 'dataCubes/RESET',
  SAVE_BEGIN: 'dataCubes/SAVE_BEGIN',
  SAVE_SUCCESS: 'dataCubes/SAVE_SUCCESS',
  SAVE_FAIL: 'dataCubes/SAVE_FAIL',
  UPDATING_START: 'dataCubes/UPDATING_START',
  UPDATING_END: 'dataCubes/UPDATING_END',
  FETCH_SCHEDULE_BEGIN: 'dataCubes/FETCH_SCHEDULE_BEGIN',
  FETCH_SCHEDULE_SUCCESS: 'dataCubes/FETCH_SCHEDULE_SUCCESS',
  FETCH_SCHEDULE_FAIL: 'dataCubes/FETCH_SCHEDULE_FAIL',
};

/**
 * Action to load the cubes.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/data_cubes/cubes')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to create/update a cube.
 *
 * @param {Object} data
 */
export const save = data => ({
  types: [
    actionTypes.SAVE_BEGIN,
    actionTypes.SAVE_SUCCESS,
    actionTypes.SAVE_FAIL
  ],
  makeRequest: client => client.post('/api/data_cubes/cubes', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to mark a cube as being updating.
 * @param {Number} id
 */
export const updatingStart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove the current cube as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});


/**
 * Action to load a cube's schedule.
 */
export const fetchSchedule = (id) => ({
  types: [
    actionTypes.FETCH_SCHEDULE_BEGIN,
    actionTypes.FETCH_SCHEDULE_SUCCESS,
    actionTypes.FETCH_SCHEDULE_FAIL
  ],
  makeRequest: client => client.get('/api/data_cubes/schedule', {
    params: {
      cube_id: id
    }
  })
});
