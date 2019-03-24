import {
  createSelectAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../reducers/itemListSelectReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'etlCurrentStatus/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlCurrentStatus/FETCH_SUCCESS',
  FETCH_FAIL: 'etlCurrentStatus/FETCH_FAIL',
  RESET: 'etlCurrentStatus/RESET',
  SELECT: 'etlCurrentStatus/SELECT',
  UNSELECT: 'etlCurrentStatus/UNSELECT',
  UNSELECT_ALL: 'etlCycleHistory/UNSELECT_ALL'
};

/**
 * Action to fetch the ETL current status.
 */
export const fetchCurrentStatus = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/data_marts_status')
});

/**
 * Action to select a data mart status item.
 */
export const select = createSelectAction(actionTypes.SELECT);

/**
 * Action to unselect a data mart status item.
 */
export const unselect = createUnselectAction(actionTypes.UNSELECT);

/**
 * Action to unselect all the data mart status items.
 */
export const unselectAll = createUnselectAllAction(actionTypes.UNSELECT_ALL);
