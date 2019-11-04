import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../../reducers/itemListSelectReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'dataCubesDims/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataCubesDims/FETCH_SUCCESS',
  FETCH_FAIL: 'dataCubesDims/FETCH_FAIL',
  RESET: 'dataCubesDims/RESET',
  SELECT: 'dataCubesDims/SELECT',
  SELECT_ALL: 'dataCubesDims/SELECT_ALL',
  UNSELECT: 'dataCubesDims/UNSELECT',
  UNSELECT_ALL: 'dataCubesDims/UNSELECT_ALL'
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
  makeRequest: client => client.get('/api/data_cubes/dims'),
  shouldMakeRequest: getState => !getState().dataCubesDims.dataLoaded
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
