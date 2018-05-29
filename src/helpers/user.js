import { isEmpty } from 'javascript-utils/lib/utils';
import { JWT_ACCESS_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY } from 'constants/index';

/**
 * Returns the JWT access token.
 * @returns {String | null}
 */
export const getAccessToken = () => window.localStorage.getItem(JWT_ACCESS_TOKEN_KEY);

/**
 * Sets the JWT access token.
 * @param {String|undefined} accessToken
 */
export const setAccessToken = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem(JWT_ACCESS_TOKEN_KEY, accessToken);
  } else {
    window.localStorage.removeItem(JWT_ACCESS_TOKEN_KEY);
  }
};

/**
 * Returns the JWT refresh token.
 * @returns {String | null}
 */
export const getRefreshToken = () => window.localStorage.getItem(JWT_REFRESH_TOKEN_KEY);

/**
 * Sets the JWT refresh token.
 * @param {String|undefined} refreshToken
 */
export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    window.localStorage.setItem(JWT_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(JWT_REFRESH_TOKEN_KEY);
  }
};

/**
 * Checks if the specified access token matches the one stored
 * in the local storage.
 * @param {String} accessToken
 * @returns {Boolean}
 */
export const isValidAccessToken = (accessToken) => {
  const storedAccessToken = getAccessToken();
  if (isEmpty(storedAccessToken) || isEmpty(accessToken)) {
    return false;
  }

  return accessToken === storedAccessToken;
};
