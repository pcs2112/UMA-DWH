import { createSelector } from 'reselect';
import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetPropertySelector
} from 'helpers/selectors';
import etlControlManager from 'redux/modules/etlControlManager';

/**
 * Returns the history data from the state.
 * @param {Object} state
 */
const _getData = createDataSelector('etlCycleHistory');

/**
 * Return the selected order from the state.
 */
const _getSelectedOrder = createGetPropertySelector('etlCycleHistory', 'selectedOrder');

/**
 * Returns the ETL history from the state.
 */
export const getHistory = createGetItemsSelector(_getData);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlCycleHistory');

/**
 * Returns the cycle history list filters.
 */
export const getFilters = createGetPropertySelector('etlCycleHistory', 'filters');

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = state => state.etlCycleHistory.selected;

/**
 * Returns the current cycle group.
 */
export const getCurrentCycleGroup = state => state.etlCycleHistory.currentCycleGroup || 0;

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
  [_getSelectedOrder, getSelected],
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

/**
 * Selector to get the total count of data marts selected.
 */
export const getDataMartsSelectedCount = createSelector(
  [getSelected],
  (selected) => {
    const keys = Object.keys(selected);
    let selectedCount = 0;

    keys.forEach((key) => {
      if (!objectHasOwnProperty(selected[key], 'calling_proc')) {
        selectedCount++;
      }
    });

    return selectedCount;
  }
);

/**
 * Selector to get the data marts selected.
 */
export const getDataMartsSelected = createSelector(
  [getSelected],
  (selected) => {
    const dataMartsSelected = {};
    const keys = Object.keys(selected);

    keys.forEach((key) => {
      if (!objectHasOwnProperty(selected[key], 'calling_proc')) {
        dataMartsSelected[key] = selected[key];
      }
    });

    return dataMartsSelected;
  }
);

/**
 * Returns the ETL history by cycle group from the state.
 */
export const getHistoryByCycleGroup = createSelector(
  [_getData, getCurrentCycleGroup, getDataMartsSelected, etlControlManager.selectors.getControlManager, getFilters],
  (data, cycleGroup, dataMarts, controlManager, filters) => {
    if (data.length < 1 || controlManager.length < 1) {
      return [];
    }

    // Get the data mart selected count
    const dataMartsSelected = Object.keys(dataMarts).length;

    // Get the map of procedure names to item index
    const map = {};
    const dataByCycleGroup = data.filter(item => item.cycle_group === cycleGroup);
    dataByCycleGroup.forEach((item, index) => {
      const key = item.calling_proc.toLowerCase();
      map[key] = index;
    });

    // Get the empty result for missing history items
    const keys = Object.keys(data[0]);
    const defaultMissingItem = {};
    keys.forEach((key) => {
      defaultMissingItem[key] = '';
    });

    // Put together the result set
    const result = [];
    controlManager.forEach((item) => {
      if (dataMartsSelected < 1 || objectHasOwnProperty(dataMarts, item.data_mart_name)) {
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
          missingItem.source_server_name = item.source_server_name;
          missingItem.source_db_name = item.source_db_name;
          missingItem.source_table_name = item.source_table_name;
          missingItem.target_table_name = item.target_table_name;
          missingItem.source_schema_name = item.source_schema_name;
          missingItem.target_schema_name = item.target_schema_name;
          missingItem.active = 1;
          result.push(missingItem);
        }
      }
    });

    if (objectHasOwnProperty(filters, 'active') && filters.active === 0) {
      return result.filter(res => res.active === 0);
    }

    return result;
  }
);

/**
 * Returns the current cycle group's start dttm.
 */
export const getCurrentCycleGroupStartDttm = createSelector(
  [_getData],
  data => (data.length > 0 ? data[0].start_dttm : 'N/A')
);
