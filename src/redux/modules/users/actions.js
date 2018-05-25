import { catchValidation } from 'helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'users/FETCH_BEGIN',
  FETCH_SUCCESS: 'users/FETCH_SUCCESS',
  FETCH_FAIL: 'users/FETCH_FAIL',
  RESET: 'users/RESET',
  CREATE_USER_BEGIN: 'users/CREATE_USER_BEGIN',
  CREATE_USER_SUCCESS: 'users/CREATE_USER_SUCCESS',
  CREATE_USER_FAIL: 'users/CREATE_USER_FAIL',
  UPDATE_USER_BEGIN: 'users/UPDATE_USER_BEGIN',
  UPDATE_USER_SUCCESS: 'users/UPDATE_USER_SUCCESS',
  UPDATE_USER_FAIL: 'users/UPDATE_USER_FAIL'
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
export const createUser = data => ({
  types: [
    actionTypes.CREATE_USER_BEGIN,
    actionTypes.CREATE_USER_SUCCESS,
    actionTypes.CREATE_USER_FAIL
  ],
  makeRequest: client => client.post('/api/users', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to update an existing user.
 *
 * @param {Number} id
 * @param {Object} data
 */
export const updateUser = (id, data) => ({
  types: [
    actionTypes.UPDATE_USER_BEGIN,
    actionTypes.UPDATE_USER_SUCCESS,
    actionTypes.UPDATE_USER_FAIL
  ],
  makeRequest: client => client.post(`/api/users/${id}`, {
    data
  })
    .catch(catchValidation)
});
