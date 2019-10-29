import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../../reducers/itemListSelectReducerFor';
import { getUpdatingCube } from '../cubes/selectors';
import { getAllData, getDimColumnNameIdx } from './selectors';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubesDims/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubesDims/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubesDims/FETCH_FAIL',
  RESET: 'dataCubesDims/RESET',
  SELECT: 'dataCubesDims/SELECT',
  SELECT_ALL: 'dataCubesDims/SELECT_ALL',
  UNSELECT: 'dataCubesDims/UNSELECT',
  UNSELECT_ALL: 'dataCubesDims/UNSELECT_ALL',
  INIT_SELECTED: 'dataCubesDims/INIT_SELECTED'
};

/**
 * Action to load the dims.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/data_cubes/dims')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to select items.
 */
export const select = createSelectAction(actionTypes.SELECT);

/**
 * Action to select all items.
 */
export const selectAll = createSelectAllAction(actionTypes.SELECT_ALL);


/**
 * Action to unselect an item.
 */
export const unselect = createUnselectAction(actionTypes.UNSELECT);

/**
 * Action to unselect all items.
 */
export const unselectAll = createUnselectAllAction(actionTypes.UNSELECT_ALL);

/**
 * Inititalizes the selected dims.
 */
export const initSelected = () => (dispatch, getState) => {
  const state = getState();
  const cube = getUpdatingCube(state);
  const dims = getAllData(state);
  const dimColumnNameIdx = getDimColumnNameIdx(state);
  const selected = {};
  const selectedOrder = [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cube.xml_document, 'text/xml');
  const factElements = xmlDoc.getElementsByTagName('fact');
  factElements.forEach((factEl) => {
    const fact = factEl.getAttribute('table');
    selected[fact] = {};
    const dimsElements = factEl.getElementsByTagName('dimension');
    dimsElements.forEach((dimEl) => {
      const dim = dims[dimColumnNameIdx[dimEl.textContent]];
      selected[fact][dim.id] = dim;
      selectedOrder.push(dim.id);
    });
  });

  dispatch({
    type: actionTypes.INIT_SELECTED,
    selected,
    selectedOrder
  });
};
