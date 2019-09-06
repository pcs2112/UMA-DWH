export const actionTypes = {
  FETCH_BEGIN: 'telecomSkills/FETCH_BEGIN',
  FETCH_SUCCESS: 'telecomSkills/FETCH_SUCCESS',
  FETCH_FAIL: 'telecomSkills/FETCH_FAIL'
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
