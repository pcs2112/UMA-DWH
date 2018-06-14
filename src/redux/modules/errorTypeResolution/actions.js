import { catchValidation } from 'helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'errorTypeResolution/FETCH_BEGIN',
  FETCH_SUCCESS: 'errorTypeResolution/FETCH_SUCCESS',
  FETCH_FAIL: 'errorTypeResolution/FETCH_FAIL',
  CREATE_BEGIN: 'errorTypeResolution/CREATE_BEGIN',
  CREATE_SUCCESS: 'errorTypeResolution/CREATE_SUCCESS',
  CREATE_FAIL: 'errorTypeResolution/CREATE_FAIL',
  UPDATE_BEGIN: 'errorTypeResolution/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'errorTypeResolution/UPDATE_SUCCESS',
  UPDATE_FAIL: 'errorTypeResolution/UPDATE_FAIL',
  UPDATING_START: 'errorTypeResolution/UPDATING_START',
  UPDATING_END: 'errorTypeResolution/UPDATING_END'
};

/**
 * Action to load the error type resolution data.
 */
export const fetchData = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/error_type_resolution')
});

/**
 * Action to create a new file.
 *
 * @param {Object} data
 */
export const createFile = data => ({
  types: [
    actionTypes.CREATE_BEGIN,
    actionTypes.CREATE_SUCCESS,
    actionTypes.CREATE_FAIL
  ],
  makeRequest: client => client.post('/api/error_type_resolution', {
    data
  })
    .catch(catchValidation)
});

/**
 * Action to update an existing file.
 *
 * @param {Number} id
 * @param {Object} data
 */
export const updateFile = (id, data) => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.post(`/api/error_type_resolution/${id}`, {
    data
  })
    .catch(catchValidation),
  payload: {
    id
  }
});

/**
 * Action to mark a file as being updating.
 * @param {Number} id
 */
export const updatingFiletart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove a file as being updating.
 */
export const updatingFileEnd = () => ({
  type: actionTypes.UPDATING_END
});
