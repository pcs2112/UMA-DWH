export const initialState = {
  selected: {},
  selectedOrder: []
};

/**
 * Reusable factory reducer to select a items from a list.
 *
 * @param {Object} actionTypes
 * @returns {Function}
 */
const itemListSelectReducerFor = ({
  SELECT, UNSELECT, UNSELECT_ALL
}) => (state = initialState, action) => {
  switch (action.type) {
    case SELECT: {
      // Add the selected item
      const selected = {
        ...state.selected,
        [action.id]: action.data
      };

      // Add the selected item to the selected order
      const selectedOrder = [...state.selectedOrder];
      selectedOrder.push(action.id);

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
      delete (selected[action.id]);

      // Remove the unselected items from the selected order
      const selectedOrder = state.selectedOrder.filter(item => item !== action.id);

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
