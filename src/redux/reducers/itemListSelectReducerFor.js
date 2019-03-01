export const initialState = {
  selected: {},
  selectedOrder: [],
  data: false
};

export const selectAllReducer = (keyName, state) => {
  const { data } = state;
  const selected = {};
  const selectedOrder = [];

  if (data.length > 0) {
    data.forEach((item) => {
      selected[item[keyName]] = item;
      selectedOrder.push(item[keyName]);
    });
  }

  return {
    ...state,
    selected,
    selectedOrder
  };
};

export const unselectAllReducer = state => ({
  ...state,
  selected: initialState.selected,
  selectedOrder: initialState.selectedOrder
});

/**
 * Reusable factory reducer to select a items from a list.
 *
 * @param {Object} actionTypes
 * @param {String} keyName
 * @returns {Function}
 */
const itemListSelectReducerFor = ({
  SELECT, UNSELECT, SELECT_ALL, UNSELECT_ALL
}, keyName) => (state = initialState, action) => {
  switch (action.type) {
    case SELECT: {
      // Add the selected item
      const selected = {
        ...state.selected,
        [action.data[keyName]]: action.data
      };

      // Add the selected item to the selected order
      const selectedOrder = [...state.selectedOrder];
      selectedOrder.push(action.data[keyName]);

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case UNSELECT: {
      const selected = {
        ...state.selected
      };

      // Remove the unselected item
      delete (selected[action.keyValue]);

      // Remove the unselected items from the selected order
      const selectedOrder = state.selectedOrder.filter(item => item !== action.keyValue);

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case SELECT_ALL:
      return selectAllReducer(keyName, state, action);
    case UNSELECT_ALL:
      return unselectAllReducer(state);
    default:
      return state;
  }
};

export default itemListSelectReducerFor;
