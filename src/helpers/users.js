/**
 * Checks if the specified user is and admin user.
 *
 * @param {Object} user
 * @returns {Boolean}
 */
export const isAdmin = user => [1, 2].findIndex(item => user.id === item) !== undefined;

/**
 * Checks the specified user is the current application user.
 *
 * @param {Object} currentUser
 * @param {Object} user
 * @returns {boolean}
 */
export const isCurrentUser = (currentUser, user) => currentUser.id === user.id;
