import { createStore as _createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reduxPollingMiddleware } from 'redux-polling';
import clientMiddleware from './middleware/apiClient';
import appErrorMiddleware from './middleware/appError';

export default (client, data) => {
  const middleware = [clientMiddleware(client), appErrorMiddleware, thunk, reduxPollingMiddleware];
  const finalCreateStore = applyMiddleware(...middleware)(_createStore);
  const reducer = require('./reducer');
  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
  }

  return store;
};
