import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../../reducers/itemListSelectReducerFor';

import { getUpdatingCube } from '../cubes/selectors';
import { getData as getFacts, getFactIdx } from './selectors';
import { getAllData as getDims, getDimIdx } from '../dims/selectors';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubesFacts/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubesFacts/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubesFacts/FETCH_FAIL',
  RESET: 'dataCubesFacts/RESET',
  SELECT: 'dataCubesFacts/SELECT',
  SELECT_ALL: 'dataCubesFacts/SELECT_ALL',
  UNSELECT: 'dataCubesFacts/UNSELECT',
  UNSELECT_ALL: 'dataCubesFacts/UNSELECT_ALL',
  INIT_SELECTED: 'dataCubesFacts/INIT_SELECTED'
};

/**
 * Action to load the facts.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/data_cubes/facts'),
  shouldMakeRequest: getState => !getState().dataCubesFacts.dataLoaded
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
 * Inititalizes the selected facts.
 */
export const initSelected = () => (dispatch, getState) => {
  const state = getState();
  const cube = getUpdatingCube(state);
  const facts = getFacts(state);
  const factsIdx = getFactIdx(state);
  const dims = getDims(state);
  const dimIdx = getDimIdx(state);
  const selectedFacts = {};
  const selectedFactsOrder = [];
  const selectedDims = {};
  const selectedDimsOrder = [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cube.xml_document, 'text/xml');
  const factElements = xmlDoc.getElementsByTagName('fact');
  factElements.forEach((factEl) => {
    const fact = factEl.getAttribute('table').toUpperCase();
    selectedFacts[fact] = facts[factsIdx[fact]];
    selectedFactsOrder.push(fact);

    selectedDims[fact] = {};
    const dimsElements = factEl.getElementsByTagName('dimension');
    dimsElements.forEach((dimEl) => {
      const dim = dims[dimIdx[`${fact}.${dimEl.textContent.toUpperCase()}`]];
      selectedDims[fact][dim.id] = dim;
      selectedDimsOrder.push(dim.id);
    });
  });

  dispatch({
    type: actionTypes.INIT_SELECTED,
    selectedFacts,
    selectedFactsOrder,
    selectedDims,
    selectedDimsOrder
  });
};
