import { createSetFilterAction } from '../../reducers/itemListFiltersReducerFor';
import { FILTERS_STATE_KEY_NAME } from './constants';

export const actionTypes = {
  FETCH_BEGIN: 'etlManagement/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlManagement/FETCH_SUCCESS',
  FETCH_FAIL: 'etlManagement/FETCH_FAIL',
  RESET: 'etlManagement/RESET',
  SET_FILTERS: 'etlManagement/SET_FILTERS'
};

/**
 * Action to fetch the ETL management.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/management')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to set a filter.
 */
export const setFilter = createSetFilterAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);
