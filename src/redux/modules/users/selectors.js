import { createSelector } from 'reselect';

const emptyData = [];

/**
 * Returns the history data from the state.
 * @param {Object} state
 */
const getData = state => (state.users.dataLoaded ? state.users.data : emptyData);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = state =>
  (state.users.fetchingError && state.users.fetchingError.payload
    ? state.users.fetchingError.payload
    : false
  );

/**
 * Selector to get the selected items count.
 */
export const getUsers = createSelector(
  [getData],
  users => users
);
