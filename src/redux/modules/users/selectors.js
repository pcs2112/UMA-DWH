import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetPropertySelector,
  createGetItemByIdSelector
} from 'helpers/selectors';

/**
 * Returns the item list from the state.
 */
const _getData = createDataSelector('users');

/**
 * Returns the updating user id.
 */
const _getUpdatingUserId = createGetPropertySelector('users', 'updating');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('users');

/**
 * Selector to get the users.
 */
export const getUsers = createGetItemsSelector(_getData);

/**
 * Returns the current updating user.
 */
export const getUpdatingUser = createGetItemByIdSelector(_getData, _getUpdatingUserId);

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
      id: user.id,
      employee_first_name: user.employee_first_name,
      employee_last_name: user.employee_last_name,
      employee_email: user.employee_email,
      employee_phone: user.employee_phone,
      employee_cell_phone: user.employee_cell_phone,
      employee_password: ''
    };
  }
);
