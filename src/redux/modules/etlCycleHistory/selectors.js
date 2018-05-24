import { createSelector } from 'reselect';
import etlControlManager from 'redux/modules/etlControlManager';
import { objectHasOwnProperty } from 'helpers/utils';

const emptyData = [];

/**
 * Returns the history data from the state.
 * @param {Object} state
 */
const getData = state => (state.etlCycleHistory.dataLoaded ? state.etlCycleHistory.data : emptyData);

const getSelectedOrder = state => state.etlCycleHistory.selectedOrder;

/**
 * Returns the error from the state.
 * @param {Object} state
 */
const getError = state =>
  (state.etlCycleHistory.fetchingError && state.etlCycleHistory.fetchingError.payload
    ? state.etlCycleHistory.fetchingError.payload
    : false
  );

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = state => state.etlCycleHistory.selected;

/**
 * Returns the current cycle group.
 */
export const currentCycleGroup = state => state.etlCycleHistory.currentCycleGroup || 0;

/**
 * Returns the ETL history by cycle group from the state.
 */
export const historyByCycleGroup = createSelector(
  [getData, currentCycleGroup, etlControlManager.selectors.controlManager],
  (data, cycleGroup, controlManager) => {
    if (data.length < 1 || controlManager.length < 1) {
      return [];
    }
    // Get the map of procedure names to item index
    const map = {};
    const dataByCycleGroup = data.filter(item => item.cycle_group === cycleGroup);
    dataByCycleGroup.forEach((item, index) => {
      const key = item.calling_proc.toLowerCase();
      map[key] = index;
    });

    // Get the empty result for missing history items
    const keys = Object.keys(dataByCycleGroup[0]);
    const defaultMissingItem = {};
    keys.forEach((key) => {
      defaultMissingItem[key] = '';
    });

    // Put together the result set
    const result = [];
    controlManager.forEach((item) => {
      const key = item.procedure_name.toLowerCase();
      const historyItemIndex = objectHasOwnProperty(map, key) ? map[key] : -1;
      if (historyItemIndex > -1) {
        result.push(dataByCycleGroup[historyItemIndex]);
      } else {
        const missingItem = { ...defaultMissingItem };
        missingItem.id = `${item.procedure_name}_${cycleGroup}`;
        missingItem.calling_proc = item.procedure_name;
        missingItem.cycle_group = cycleGroup;
        missingItem.data_mart_name = item.data_mart_name;
        missingItem.table_status = 'NOT STARTED';
        result.push(missingItem);
      }
    });

    return result;
  }
);

/**
 * Returns the current cycle group's start dttm.
 */
export const currentCycleGroupStartDttm = createSelector(
  [historyByCycleGroup],
  data => (data.length > 0 ? data[0].start_dttm : 'N/A')
);

/**
 * Returns the ETL history from the state.
 */
export const history = createSelector(
  [getData],
  data => data
);

/**
 * Returns the ETL history error from the state.
 */
export const historyError = createSelector(
  [getError],
  error => error
);

/**
 * Selector to get the total count of procedures and data marts selected.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);

/**
 * Selector to get the total count of procedures selected.
 */
export const getProceduresSelectedCount = createSelector(
  [getSelected],
  (selected) => {
    const keys = Object.keys(selected);
    let selectedCount = 0;

    keys.forEach((key) => {
      if (objectHasOwnProperty(selected[key], 'calling_proc')) {
        selectedCount++;
      }
    });

    return selectedCount;
  }
);

/**
 * Selector to get the procedures selected.
 */
export const getProceduresSelected = createSelector(
  [getSelected],
  (selected) => {
    const proceduresSelected = {};
    const keys = Object.keys(selected);

    keys.forEach((key) => {
      if (objectHasOwnProperty(selected[key], 'calling_proc')) {
        proceduresSelected[key] = selected[key];
      }
    });

    return proceduresSelected;
  }
);

/**
 * Selector to get the last procedure selected.
 */
export const getLastProcedureSelected = createSelector(
  [getSelectedOrder, getSelected],
  (selectedOrder, selected) => {
    if (selectedOrder.length < 1) {
      return undefined;
    }

    const selectedOrderReversed = selectedOrder.reverse();
    const selectedProcedureName = selectedOrderReversed.find(procedureName =>
      objectHasOwnProperty(selected, procedureName) && objectHasOwnProperty(selected[procedureName], 'calling_proc'));

    if (!selectedProcedureName) {
      return undefined;
    }

    return selected[selectedProcedureName];
  }
);
