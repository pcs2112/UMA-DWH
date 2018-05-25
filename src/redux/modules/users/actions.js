import { catchValidation } from 'helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'users/FETCH_BEGIN',
  FETCH_SUCCESS: 'users/FETCH_SUCCESS',
  FETCH_FAIL: 'users/FETCH_FAIL',
  RESET: 'users/RESET',
  CREATE_BEGIN: 'users/CREATE_BEGIN',
  CREATE_SUCCESS: 'users/CREATE_SUCCESS',
  CREATE_FAIL: 'users/CREATE_FAIL',
  UPDATE_BEGIN: 'users/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'users/UPDATE_SUCCESS',
  UPDATE_FAIL: 'users/UPDATE_FAIL'
};

/**
 * Action to load the users data.
 */
export const fetchUsers = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/users')
});

/**
 * Action to create a new user.
 *
 * @param {Object} data
 */
export const create = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/users', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to create a new user.
 *
 * @param {Number} id
 * @param {Object} data
 */
export const update = (id, data) => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.post(`/api/users/${id}`, {
    data
  })
    .catch(catchValidation)
});
