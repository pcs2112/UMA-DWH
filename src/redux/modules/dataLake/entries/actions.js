import { catchValidation } from '../../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'dataLakeEntries/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataLakeEntries/FETCH_SUCCESS',
  FETCH_FAIL: 'dataLakeEntries/FETCH_FAIL',
  RESET: 'dataLakeEntries/RESET',
  CREATE_BEGIN: 'dataLakeEntries/CREATE_BEGIN',
  CREATE_SUCCESS: 'dataLakeEntries/CREATE_SUCCESS',
  CREATE_FAIL: 'dataLakeEntries/CREATE_FAIL',
  UPDATE_BEGIN: 'dataLakeEntries/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'dataLakeEntries/UPDATE_SUCCESS',
  UPDATE_FAIL: 'dataLakeEntries/UPDATE_FAIL',
  UPDATING_START: 'dataLakeEntries/UPDATING_START',
  UPDATING_END: 'dataLakeEntries/UPDATING_END'
};

/**
 * Action to load the entries.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/data_lake/entries')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to create a new entry.
 *
 * @param {Object} data
 */
export const create = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/data_lake/entries', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to update an existing entry.
 *
 * @param {Object} data
 */
export const update = data => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.put('/api/data_lake/entries', {
    data
  })
    .catch(catchValidation),
  payload: {
    id: data.entry_id
  }
});

/**
 * Action to mark an entry as being updating.
 * @param {Number} id
 */
export const updatingStart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove current entry as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});
