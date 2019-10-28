import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import {
  SELECTED_STATE_KEY_NAME,
  SELECTED_ORDER_STATE_KEY_NAME
} from './constants';
import factsRdx from '../facts';

const _getData = createDataSelector('dataCubesDims', 'dataLoaded', 'data');

const _getSelected = createGetPropertySelector('dataCubesDims', SELECTED_STATE_KEY_NAME);

const _getSelectedOrder = createGetPropertySelector('dataCubesDims', SELECTED_ORDER_STATE_KEY_NAME);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('dataCubesDims', 'fetchingError', 'payload');

/**
 * Returns the dims data.
 */
export const getAllData = createSelector(
  [_getData],
  (data) => {
    const newData = data.map((item) => ({
      ...item,
      id: `${item.fact_table}.${item.dimension_name}`
    }));

    return newData;
  }
);

export const getData = createSelector(
  [factsRdx.selectors.getSelected, getAllData],
  (selectedFacts, data) => data.filter((item) => _.has(selectedFacts, item.fact_table))
);

export const getSelectedDimFactMap = createGetPropertySelector('dataCubesDims', SELECTED_STATE_KEY_NAME);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createSelector(
  [factsRdx.selectors.getSelected, _getSelected, _getSelectedOrder],
  (selectedFacts, selectedDims, selectedOrder) => {
    const selected = [];
    const selectedFlat = {};

    Object.keys(selectedFacts).forEach((fact) => {
      if (selectedDims[fact]) {
        Object.keys(selectedDims[fact]).forEach((dimId) => {
          selectedFlat[dimId] = dimId;
        });
      }
    });

    selectedOrder.forEach((id) => {
      if (selectedFlat[id]) {
        selected.push(id);
      }
    });

    return selected;
  }
);

/**
 * Selector to get the total count of selected items.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => selected.length
);
