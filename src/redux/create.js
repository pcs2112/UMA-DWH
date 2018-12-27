import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import { reduxPollingMiddleware } from 'redux-polling';
import clientMiddleware from './middleware/apiClient';
import appErrorMiddleware from './middleware/appError';
import createReducer from './reducer';
import DevTools from '../components/DevTools';

export default (client, data) => {
  const middleware = [clientMiddleware(client), appErrorMiddleware, thunk, reduxPollingMiddleware];

  let finalCreateStore;
  if (__DEVELOPMENT__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(createReducer(), data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(createReducer());
    });
  }

  return store;
};
