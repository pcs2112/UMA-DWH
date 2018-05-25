import { catchValidation } from 'helpers/redux';

export const actionTypes = {
  LOGIN: 'user/LOGIN',
  LOGOUT: 'user/LOGOUT',
  FETCH_BEGIN: 'user/FETCH_BEGIN',
  FETCH_SUCCESS: 'user/FETCH_SUCCESS',
  FETCH_FAIL: 'user/FETCH_FAIL',
  LOGIN_BEGIN: 'user/LOGIN_BEGIN',
  LOGIN_SUCCESS: 'user/LOGIN_SUCCESS',
  LOGIN_FAIL: 'user/LOGIN_FAIL',
  SET_ACCESS_TOKENS: 'user/SET_ACCESS_TOKENS',
  SET_ACCESS_TOKEN: 'user/SET_ACCESS_TOKEN',
  CREATE_BEGIN: 'user/CREATE_BEGIN',
  CREATE_SUCCESS: 'user/CREATE_SUCCESS',
  CREATE_FAIL: 'user/CREATE_FAIL',
};

/**
 * Action to fetch the user information
 */
export const fetchUser = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/users/current')
});

/**
 * Action to login a user.
 *
 * @param {Object} data
 */
export const login = data => ({
  types: [
    actionTypes.LOGIN_BEGIN,
    actionTypes.LOGIN_SUCCESS,
    actionTypes.LOGIN_FAIL
  ],
  makeRequest: client => client.post('/api/users/login', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to logout a user.
 */
export const logout = () => ({
  type: actionTypes.LOGOUT
});

/**
 * Action to set the user's access tokens.
 * @param {String} accessToken
 * @param {String} refreshToken
 */
export const setAccessTokens = (accessToken, refreshToken) => ({
  type: actionTypes.SET_ACCESS_TOKENS,
  accessToken,
  refreshToken
});

/**
 * Action to set the user's access token.
 * @param {String} accessToken
 */
export const setAccessToken = accessToken => ({
  type: actionTypes.SET_ACCESS_TOKEN,
  accessToken
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
