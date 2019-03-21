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
 * Scrolls the specified table to the top.
 * @param {String} htmlId
 */
export const scrollTableToTop = (htmlId) => {
  document.getElementById(htmlId)
    .getElementsByClassName('rt-tbody')[0].scrollTop = 0;
};

/**
 * Reorders the specified list based on the start and end indices.
 * @param {Array} list
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @returns {any[]}
 */
export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Sort an array of objects using the specified property name.
 * Append "-" before the property name to sort in descending order.
 *
 * @param {string} property
 * @returns {function(*, *): number}
 */
export const dynamicSort = (property) => {
  let normalizedProperty = property;
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    normalizedProperty = property.substr(1);
  }

  return (a, b) => {
    let result = 0;
    if ((a[normalizedProperty] < b[normalizedProperty])) {
      result = -1;
    } else if (a[normalizedProperty] > b[normalizedProperty]) {
      result = 1;
    }

    return result * sortOrder;
  };
};

/**
 * Sort an array of objects using the specified properties.
 * Append "-" before the property name to sort in descending order.
 *
 * @param {Array} props
 * @returns {function(*, *): number}
 */
export const sortMultiple = props => (obj1, obj2) => {
  let i = 0;
  let result = 0;
  const numberOfProperties = props.length;

  while (result === 0 && i < numberOfProperties) {
    result = dynamicSort(props[i])(obj1, obj2);
    i++;
  }

  return result;
};
