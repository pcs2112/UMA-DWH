/**
 * Checks if the specified user is and admin user.
 *
 * @param {Object} user
 * @returns {Boolean}
 */
export const isAdmin = user => [1, 2].findIndex(item => user.id === item) !== undefined;
