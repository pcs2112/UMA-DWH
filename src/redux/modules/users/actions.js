export const actionTypes = {
  FETCH_BEGIN: 'users/FETCH_BEGIN',
  FETCH_SUCCESS: 'users/FETCH_SUCCESS',
  FETCH_FAIL: 'users/FETCH_FAIL',
  RESET: 'users/RESET'
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
