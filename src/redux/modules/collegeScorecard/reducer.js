import { arrayUnique } from 'javascript-utils/lib/array';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/src/utils';
import { reorderList } from '../../../helpers/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { unselectAllReducer, getInitialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes as groupsActionTypes } from '../collegeScorecardGroups/actions';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

const defaultFilters = {
  fileName: '',
  populated: '',
  query: ''
};

// Initial state
const initialState = Object.assign(
  {
    allData: [],
    selectedManually: {}
  },
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(
  actionTypes, LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Handles selecting all items from all the groups
const selectAllFromGroupsReducer = (state) => {
  const { allData } = state;
  const selected = {};
  const selectedOrder = [];

  if (allData.length > 0) {
    allData.forEach((item) => {
      selected[item[LIST_ITEM_KEY_NAME]] = item;
      selectedOrder.push(item[LIST_ITEM_KEY_NAME]);
    });
  }

  return {
    ...state,
    [SELECTED_STATE_KEY_NAME]: selected,
    [SELECTED_ORDER_STATE_KEY_NAME]: selectedOrder
  };
};

// Filters the data
const filterData = (state, action) => {
  const { data, [FILTERS_STATE_KEY_NAME]: { populated, query } } = state;
  let { allData } = state;

  if (action.type === actionTypes.FETCH_SUCCESS) {
    allData = data;
  }

  let newData = [];

  if (populated !== 'ALL') {
    newData = allData;
  } else {
    newData = allData.filter(item => item.per_pop > 0);
  }

  if (!isEmpty(query) && query.length >= 3) {
    const queryNormalized = query.toLowerCase();
    newData = newData.filter((item) => {
      const normalizedColumnName = `${item.column_name}`.toLowerCase();
      const normalizedDesc = `${item.entry_name}`.toLowerCase();
      const normalizedLongDesc = `${item.entry_description}`.toLowerCase();

      return normalizedColumnName.indexOf(queryNormalized) > -1
        || normalizedDesc.indexOf(queryNormalized) > -1
        || normalizedLongDesc.indexOf(queryNormalized) > -1;
    });
  }

  return {
    ...state,
    data: newData,
    allData
  };
};

/**
 * College scorecard reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      const newState = setFilters(itemListReducer(state, action), action);
      return filterData(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS:
      return filterData(setFilters(state, action), action);

    // Handles selecting an item
    case actionTypes.SELECT: {
      const newState = itemListSelectReducer(state, action);
      return {
        ...newState,
        selectedManually: {
          ...(newState.selectedManually || {}),
          [action.data[LIST_ITEM_KEY_NAME]]: action.data[LIST_ITEM_KEY_NAME]
        }
      };
    }

    // Handles unselecting an item
    case actionTypes.UNSELECT: {
      const newState = itemListSelectReducer(state, action);
      const newSelectedManually = {
        ...(newState.selectedManually || {})
      };
      delete (newSelectedManually[action.keyValue]);
      newState.selectedManually = newSelectedManually;
      return newState;
    }

    // Handles selecting all the items
    case actionTypes.SELECT_ALL:
      return itemListSelectReducer(state, action);

    // Handles unselecting all the items
    case actionTypes.UNSELECT_ALL: {
      const newState = itemListSelectReducer(state, action);
      newState.selectedManually = {};
      return newState;
    }

    // Handles selecting all of the items from a group
    case groupsActionTypes.SELECT: {
      const group = action.data;
      const columns = group.group_entry_id_list.trim().split(/[\s,]+/);
      if (columns.length < 1) {
        return state;
      }

      const columnLookUp = {};
      const { allData } = state;
      const selected = state[SELECTED_STATE_KEY_NAME];
      const selectedOrder = state[SELECTED_ORDER_STATE_KEY_NAME];
      const newSelected = { ...selected };
      const newSelectedOrder = [...selectedOrder];

      allData.forEach((item, i) => {
        columnLookUp[item[LIST_ITEM_KEY_NAME]] = i;
      });

      columns.forEach((column) => {
        const item = allData[columnLookUp[column]];
        if (item) {
          newSelected[item[LIST_ITEM_KEY_NAME]] = item;
          newSelectedOrder.push(item[LIST_ITEM_KEY_NAME]);
        }
      });

      return {
        ...state,
        [SELECTED_STATE_KEY_NAME]: newSelected,
        [SELECTED_ORDER_STATE_KEY_NAME]: arrayUnique(newSelectedOrder)
      };
    }

    // Handles unselecting all of the items from a group
    case groupsActionTypes.UNSELECT: {
      const { selectedManually } = state;
      const selected = state[SELECTED_STATE_KEY_NAME];
      const selectedOrder = state[SELECTED_ORDER_STATE_KEY_NAME];
      const { data } = action;
      const columns = data.group_entry_id_list.trim().split(/[\s,]+/);

      const newSeleted = {
        ...selected
      };

      columns.forEach((column) => {
        if (!objectHasOwnProperty(selectedManually, column)) {
          delete (newSeleted[column]);
        }
      });

      const newSelectedOrder = [];
      selectedOrder.forEach((item) => {
        if (objectHasOwnProperty(newSeleted, item)) {
          newSelectedOrder.push(item);
        }
      });

      return {
        ...state,
        [SELECTED_STATE_KEY_NAME]: newSeleted,
        [SELECTED_ORDER_STATE_KEY_NAME]: newSelectedOrder
      };
    }

    // Handles selecting all the items from all the groups
    case groupsActionTypes.SELECT_ALL:
      return selectAllFromGroupsReducer(state);

    // Handles unselecting all the items from all the groups
    case groupsActionTypes.UNSELECT_ALL: {
      const newState = unselectAllReducer(state, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME);
      newState.selectedManually = {};
      return newState;
    }

    // Orders the list of selected columns
    case actionTypes.REORDER: {
      const selectedOrder = state[SELECTED_ORDER_STATE_KEY_NAME];
      const { startIndex, endIndex } = action;
      const newSelectedOrder = reorderList(selectedOrder, startIndex, endIndex);

      return {
        ...state,
        [SELECTED_ORDER_STATE_KEY_NAME]: newSelectedOrder
      };
    }

    // Marks all the items from a saved report as selected
    case actionTypes.LOAD_SAVED_REPORT: {
      const { allData } = state;
      const { report } = action;
      const idxLoopup = {};
      const newSelectedManually = {};
      const newSelectedOrder = [];
      const newSelected = {};

      allData.forEach((item, i) => {
        idxLoopup[item.column_name] = i;
      });

      report.columns.forEach((col) => {
        const idx = idxLoopup[col];
        if (typeof idx !== 'undefined') {
          const column = allData[idx];
          newSelectedManually[column[LIST_ITEM_KEY_NAME]] = column[LIST_ITEM_KEY_NAME];
          newSelectedOrder.push(column[LIST_ITEM_KEY_NAME]);
          newSelected[column[LIST_ITEM_KEY_NAME]] = column;
        }
      });

      return {
        ...state,
        selectedManually: newSelectedManually,
        [SELECTED_STATE_KEY_NAME]: newSelected,
        [SELECTED_ORDER_STATE_KEY_NAME]: newSelectedOrder
      };
    }

    // Handles saving the UMA column title
    case actionTypes.SAVE_UMA_COLUMN_TITLE_SUCCESS: {
      const { columnIndex, newColumnName } = action;
      const { data } = state;
      const newData = data.slice();
      let normalizedNewColumnName = newColumnName.trim();
      if (!normalizedNewColumnName.startsWith('* :')) {
        normalizedNewColumnName = `* : ${normalizedNewColumnName}`;
      }

      newData[columnIndex] = {
        ...data[columnIndex],
        entry_description: normalizedNewColumnName
      };

      return {
        ...state,
        data: newData
      };
    }
    default:
      return state;
  }
};
