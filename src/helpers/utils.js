/**
 * Checks the specified value is empty.
 *
 * @param {String|undefined|null} value
 * @returns {Boolean}
 */
export const isEmpty = value => value === undefined || value === null || value === '';

/**
 * Delays execution of code by the specified amount of microseconds.
 *
 * @param {Number} ms
 * @returns {Promise}
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Checks whether or not a new cycle should be fetched from the server.
 *
 * @param {Number} newCycleGroup
 * @param {Number} currentStartCycleGroup
 * @param {Number} totalCycleGroups
 * @returns {Boolean}
 */
export const shouldFetchCycle = (newCycleGroup, currentStartCycleGroup, totalCycleGroups) => {
  const currentEndCycleGroup = currentStartCycleGroup + totalCycleGroups;
  const normalizedNewCycleGroup = newCycleGroup < 0 ? 0 : newCycleGroup;
  return normalizedNewCycleGroup < 1
    || normalizedNewCycleGroup < currentStartCycleGroup
    || normalizedNewCycleGroup > currentEndCycleGroup;
};

/**
 * Returns the new start cycle group based on the new cycle group
 * and the current start cycle group.
 *
 * @param {Number} newCycleGroup
 * @param {Number} currentStartCycleGroup
 * @param {Number} totalCycleGroups
 * @returns {Number}
 */
export const getNewStartCycleGroup = (newCycleGroup, currentStartCycleGroup, totalCycleGroups) => {
  const currentEndCycleGroup = currentStartCycleGroup + totalCycleGroups;
  const normalizedNewCycleGroup = newCycleGroup < 0 ? 0 : newCycleGroup;

  let newStartCycleGroup = 0;
  if (normalizedNewCycleGroup > currentEndCycleGroup) {
    newStartCycleGroup = currentEndCycleGroup + 1;
  } else if (normalizedNewCycleGroup < currentStartCycleGroup) {
    newStartCycleGroup = normalizedNewCycleGroup - totalCycleGroups;
  }

  return newStartCycleGroup;
};

/**
 * Checks the obj has the specified property.
 *
 * @param {Object} obj
 * @param {String} prop
 * @returns {Boolean}
 */
export const objectHasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
