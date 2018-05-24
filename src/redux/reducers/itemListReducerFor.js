export const initialState = {
  isFetching: false,
  fetchingError: false,
  dataLoaded: false,
  data: false,
};

/**
 * Reusable factory reducer to set async fetched data in a state.
 *
 * @param {Object} actionTypes
 * @returns {Function}
 */
const itemListReducerFor = ({
  FETCH_BEGIN, FETCH_SUCCESS, FETCH_FAIL, RESET
}) => (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BEGIN:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        dataLoaded: true,
        data: action.response,
        fetchingError: initialState.fetchingError
      };
    case FETCH_FAIL:
      return {
        ...state,
        isFetching: false,
        fetchingError: action.error
      };
    case RESET:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};

export default itemListReducerFor;
