import { createSelector } from 'reselect';

const emptyData = [];

/**
 * Returns the history data from the state.
 * @param {Object} state
 */
const getData = state => (state.users.dataLoaded ? state.users.data : emptyData);

const getUpdatingUserId = state => state.users.updating;

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

/**
 * Returns the current updating user.
 */
export const getUpdatingUser = createSelector(
  [getData, getUpdatingUserId],
  (users, updatingUserId) => (updatingUserId ? users.find(user => user.id === updatingUserId) : undefined)
);

/**
 * Gets the initial form values for the updating user.
 */
export const getUpdatingUserInitialValues = createSelector(
  [getUpdatingUser],
  (user) => {
    if (!user) {
      return {};
    }

    return {
      employee_first_name: user.employee_first_name,
      employee_last_name: user.employee_last_name,
      employee_email: user.employee_email,
      employee_phone: user.employee_phone,
      employee_cell_phone: user.employee_cell_phone,
      employee_password: ''
    };
  }
);
