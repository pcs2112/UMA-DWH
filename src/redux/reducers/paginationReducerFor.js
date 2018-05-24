export const initialState = {
  startId: 0,
  pageSize: 100,
  count: 0
};

/**
 * Reusable factory reducer to set pagination data in a state.
 *
 * @param {String} actionType
 * @returns {Function}
 */
const paginationReducerFor = actionType => (state = initialState, action) => {
  const { type, payload } = action;
  if (type === actionType) {
    const {
      startElement,
      pageSize,
      count,
    } = payload;

    return Object.assign({}, state, {
      startElement,
      pageSize,
      count,
    });
  }

  return state;
};

export default paginationReducerFor;
