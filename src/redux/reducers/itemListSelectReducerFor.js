export const initialState = {
  selected: {},
  selectedOrder: [],
  data: false
};

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
    case SELECT_ALL: {
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
    }
    case UNSELECT_ALL:
      return {
        ...state,
        selected: initialState.selected,
        selectedOrder: initialState.selectedOrder
      };
    default:
      return state;
  }
};

export default itemListSelectReducerFor;
