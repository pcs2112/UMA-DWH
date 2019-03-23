const SELECTED_KEY_NAME = 'selected';
const SELECTED_ORDER_KEY_NAME = 'selectedOrder';
const DATA_KEY_NAME = 'data';

/**
 * Action to select items.
 */
export const createSelectAction = actionType => data => ({
  type: actionType,
  data
});

/**
 * Action to select all items.
 */
export const createSelectAllAction = actionType => keyName => ({
  type: actionType,
  keyName
});

/**
 * Action to unselect an item.
 */
export const createUnselectAction = actionType => (keyValue, data) => ({
  type: actionType,
  keyValue,
  data
});

/**
 * Action to unselect all items.
 */
export const createUnselectAllAction = actionType => () => ({
  type: actionType
});

/**
 * Returns the initial state.
 *
 * @param {String} selectedKeyName
 * @param {String} selectedOrderKeyName
 * @returns {Object}
 */
export const getInitialState = (
  selectedKeyName = SELECTED_KEY_NAME,
  selectedOrderKeyName = SELECTED_ORDER_KEY_NAME
) =>
  ({
    [selectedKeyName]: {},
    [selectedOrderKeyName]: []
  });

/**
 * Helper reducer to mark all items as selected.
 *
 * @param {Object} state
 * @param {String} itemKeyName
 * @param {String} selectedKeyName
 * @param {String} selectedOrderKeyName
 * @param {String} dataKeyName
 *
 * @returns {Object}
 */
export const selectAllReducer = (
  state,
  itemKeyName,
  selectedKeyName = SELECTED_KEY_NAME,
  selectedOrderKeyName = SELECTED_ORDER_KEY_NAME,
  dataKeyName = DATA_KEY_NAME
) => {
  const data = state[dataKeyName];
  const selected = {};
  const selectedOrder = [];

  if (data.length > 0) {
    data.forEach((item) => {
      selected[item[itemKeyName]] = item;
      selectedOrder.push(item[itemKeyName]);
    });
  }

  return {
    ...state,
    [selectedKeyName]: selected,
    [selectedOrderKeyName]: selectedOrder
  };
};

/**
 * Helper reducer to mark all items as unselected.
 *
 * @param {Object} state
 * @param {String} selectedKeyName
 * @param {String} selectedOrderKeyName
 *
 * @returns {Object}
 */
export const unselectAllReducer = (
  state,
  selectedKeyName = SELECTED_KEY_NAME,
  selectedOrderKeyName = SELECTED_ORDER_KEY_NAME
) => {
  const initialState = getInitialState(selectedKeyName, selectedOrderKeyName);
  return {
    ...state,
    [selectedKeyName]: initialState[selectedKeyName],
    [selectedOrderKeyName]: initialState[selectedOrderKeyName]
  };
};

/**
 * Reusable factory reducer to select a items from a list.
 *
 * @param {Object} actionTypes
 * @param {String} itemKeyName
 * @param {String} selectedKeyName
 * @param {String} selectedOrderKeyName
 * @param {String} dataKeyName
 *
 * @returns {Function}
 */
const itemListSelectReducerFor = (
  {
    SELECT, UNSELECT, SELECT_ALL, UNSELECT_ALL
  },
  itemKeyName,
  selectedKeyName = SELECTED_KEY_NAME,
  selectedOrderKeyName = SELECTED_ORDER_KEY_NAME,
  dataKeyName = DATA_KEY_NAME
) =>
  (state = getInitialState(selectedKeyName, selectedOrderKeyName), action) => {
    if (!state[dataKeyName]) {
      return state;
    }

    switch (action.type) {
      case SELECT: {
        // Add the selected item
        const selected = {
          ...state[selectedKeyName],
          [action[dataKeyName][itemKeyName]]: action[dataKeyName]
        };

        // Add the selected item to the selected order
        const selectedOrder = [...state[selectedOrderKeyName]];
        selectedOrder.push(action[dataKeyName][itemKeyName]);

        return {
          ...state,
          [selectedKeyName]: selected,
          [selectedOrderKeyName]: selectedOrder
        };
      }
      case UNSELECT: {
        const selected = {
          ...state[selectedKeyName]
        };

        // Remove the unselected item
        delete (selected[action.keyValue]);

        // Remove the unselected items from the selected order
        const selectedOrder = state[selectedOrderKeyName].filter(item => item !== action.keyValue);

        return {
          ...state,
          [selectedKeyName]: selected,
          [selectedOrderKeyName]: selectedOrder
        };
      }
      case SELECT_ALL:
        return selectAllReducer(state, itemKeyName, selectedKeyName, selectedOrderKeyName, dataKeyName);
      case UNSELECT_ALL:
        return unselectAllReducer(state, selectedKeyName, selectedOrderKeyName);
      default:
        return state;
    }
  };

export default itemListSelectReducerFor;
