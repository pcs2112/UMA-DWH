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
