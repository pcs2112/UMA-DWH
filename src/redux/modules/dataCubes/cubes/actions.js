import { catchValidation } from '../../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubes/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubes/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubes/FETCH_FAIL',
  RESET: 'dataCubes/RESET',
  CREATE_BEGIN: 'dataCubes/CREATE_BEGIN',
  CREATE_SUCCESS: 'dataCubes/CREATE_SUCCESS',
  CREATE_FAIL: 'dataCubes/CREATE_FAIL',
  UPDATE_BEGIN: 'dataCubes/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'dataCubes/UPDATE_SUCCESS',
  UPDATE_FAIL: 'dataCubes/UPDATE_FAIL',
  UPDATING_START: 'dataCubes/UPDATING_START',
  UPDATING_END: 'dataCubes/UPDATING_END'
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
 * Action to create a new cube.
 *
 * @param {Object} data
 */
export const create = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/data_cubes/cubes', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to update an existing cube.
 *
 * @param {Object} data
 */
export const update = data => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.put('/api/data_cubes/cubes', {
    data
  })
    .catch(catchValidation),
  payload: {
    id: data.cube_id
  }
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
 * Action to remove current cube as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});
