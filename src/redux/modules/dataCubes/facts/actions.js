import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../../reducers/itemListSelectReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubesFacts/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubesFacts/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubesFacts/FETCH_FAIL',
  RESET: 'dataCubesFacts/RESET',
  SELECT: 'dataCubesFacts/SELECT',
  SELECT_ALL: 'dataCubesFacts/SELECT_ALL',
  UNSELECT: 'dataCubesFacts/UNSELECT',
  UNSELECT_ALL: 'dataCubesFacts/UNSELECT_ALL'
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
  makeRequest: client => client.get('/api/data_cubes/facts')
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
