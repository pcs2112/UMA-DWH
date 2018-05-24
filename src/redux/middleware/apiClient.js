export default client => ({ dispatch, getState }) => next => (action) => {
  const {
    types,
    makeRequest,
    shouldMakeRequest = () => true,
    payload = {}
  } = action;

  if (!types) {
    // Normal action: pass it on
    return next(action);
  }

  if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
    throw new Error('Expected an array of three string types.');
  }

  if (typeof makeRequest !== 'function') {
    throw new Error('Expected makeRequest to be a function.');
  }

  if (!shouldMakeRequest(getState)) {
    return Promise.resolve();
  }

  // Set the JWT access token from the user state
  const { accessToken } = getState().user;
  client.setAccessToken(accessToken);

  const [requestType, successType, failureType] = types;

  dispatch(Object.assign({}, payload, {
    type: requestType
  }));

  const actionPromise = makeRequest(client);
  actionPromise
    .then(
      response => dispatch(Object.assign({}, payload, {
        response,
        type: successType
      })),
      error => dispatch(Object.assign({}, payload, {
        error,
        type: failureType
      }))
    );

  return actionPromise;
};
