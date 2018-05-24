import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from 'helpers/user';
import { actionTypes } from './actions';

// Initial tokens
const initialAccessToken = getAccessToken();
const initialRefreshToken = getRefreshToken();

// Initial state
const initialState = {
  isFetching: false,
  fetchingError: false,
  isLoggedIn: false
};

if (initialAccessToken) {
  initialState.accessToken = initialAccessToken;
  initialState.refreshToken = initialRefreshToken;
}

/**
 * Reducer to handle the access tokens.
 * @param {Object} state
 * @param {String|Boolean} accessToken
 * @param {String|Boolean|undefined} refreshToken
 */
const setAccessTokens = (state, accessToken, refreshToken = undefined) => {
  const newState = { ...state };
  if (accessToken) {
    newState.accessToken = accessToken;
    setAccessToken(accessToken);
  } else if (accessToken === false) {
    delete (newState.accessToken);
    setAccessToken(undefined);
  }

  if (refreshToken) {
    newState.refreshToken = refreshToken;
    setRefreshToken(refreshToken);
  } else if (refreshToken === false) {
    delete (newState.refreshToken);
    setRefreshToken(undefined);
  }

  return newState;
};

/**
 * User reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchingError: false,
        isLoggedIn: true,
        ...action.response
      };
    case actionTypes.FETCH_FAIL:
      return {
        ...state,
        isFetching: false,
        fetchingError: action.error,
        isLoggedIn: false
      };
    case actionTypes.LOGOUT:
      setAccessTokens(state, false, false);
      return {
        isFetching: false,
        fetchingError: false,
        isLoggedIn: false
      };
    case actionTypes.LOGIN_SUCCESS: {
      const newState = setAccessTokens(state, action.response.access_token, action.response.refresh_token);
      return {
        ...newState,
        isFetching: false,
        isLoggedIn: true
      };
    }
    case actionTypes.SET_ACCESS_TOKENS:
      return setAccessTokens(state, action.accessToken, action.refreshToken);
    case actionTypes.SET_ACCESS_TOKEN:
      return setAccessTokens(state, action.accessToken);
    default:
      return state;
  }
};
