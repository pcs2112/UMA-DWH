import { catchValidation } from '../../../../helpers/redux';

export const actionTypes = {
  FETCH_BEGIN: 'telecomSkills/FETCH_BEGIN',
  FETCH_SUCCESS: 'telecomSkills/FETCH_SUCCESS',
  FETCH_FAIL: 'telecomSkills/FETCH_FAIL',
  RESET: 'telecomSkills/RESET',
  UPDATE_BEGIN: 'telecomSkills/UPDATE_BEGIN',
  UPDATE_SUCCESS: 'telecomSkills/UPDATE_SUCCESS',
  UPDATE_FAIL: 'telecomSkills/UPDATE_FAIL',
  UPDATING_START: 'telecomSkills/UPDATING_START',
  UPDATING_END: 'telecomSkills/UPDATING_END'
};

/**
 * Action to load the skills.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/telecom/skills')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to update an existing skill.
 *
 * @param {Object} data
 */
export const update = data => ({
  types: [
    actionTypes.UPDATE_BEGIN,
    actionTypes.UPDATE_SUCCESS,
    actionTypes.UPDATE_FAIL
  ],
  makeRequest: client => client.put('/api/telecom/skills', {
    data
  })
    .catch(catchValidation),
  payload: {
    id: data.skill_id
  }
});

/**
 * Action to mark a skill as being updating.
 * @param {Number} id
 */
export const updatingStart = id => ({
  type: actionTypes.UPDATING_START,
  id
});

/**
 * Action to remove current skill as being updating.
 */
export const updatingEnd = () => ({
  type: actionTypes.UPDATING_END
});
