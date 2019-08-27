import { catchValidation } from '../../../helpers/redux';
import { createSetFilterAction } from '../../reducers/itemListFiltersReducerFor';
import { FILTERS_STATE_KEY_NAME } from './constants';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardCategories/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardCategories/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardCategories/FETCH_FAIL',
  RESET: 'collegeScorecardCategories/RESET',
  CREATE_BEGIN: 'collegeScorecardCategories/CREATE_BEGIN',
  CREATE_SUCCESS: 'collegeScorecardCategories/CREATE_SUCCESS',
  CREATE_FAIL: 'collegeScorecardCategories/CREATE_FAIL',
  UPDATE_BEGIN: 'collegeScorecardCategories/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'collegeScorecardCategories/UPDATE_SUCCESS',
  UPDATE_FAIL: 'collegeScorecardCategories/UPDATE_FAIL',
  UPDATING_START: 'collegeScorecardCategories/UPDATING_START',
  UPDATING_END: 'collegeScorecardCategories/UPDATING_END'
};

/**
 * Action to fetch the College scorecard categories.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/categories')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to create a new category.
 *
 * @param {Object} data
 */
export const create = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/college_scorecard/categories', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to update an existing category.
 *
 * @param {Object} data
 */
export const update = data => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.put('/api/college_scorecard/categories', {
    data
  })
    .catch(catchValidation),
  payload: {
    id: data.id
  }
});

/**
 * Action to mark a category as being updating.
 * @param {Number} id
 */
export const updatingStart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove current category as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});

/**
 * Action to set a filter.
 */
export const setFilter = createSetFilterAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);
