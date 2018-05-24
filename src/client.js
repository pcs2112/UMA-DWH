import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import config from './config';
import createStore from './redux/create';
import { client } from './helpers/ApiClient';
import getRoutes from './routes';
import App from './routes/App';

const store = createStore(client, window.__data);

const renderApp = (renderProps) => {
  ReactDOM.render(
    <Provider store={renderProps.store}>
      <BrowserRouter>
        <App routes={renderProps.routes} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('content')
  );
};

renderApp({
  routes: getRoutes(store),
  store
});

if (!config.isProduction) {
  window.React = React;
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const devToolsDest = document.createElement('div');
  window.document.body.insertBefore(devToolsDest, null);
  const DevTools = require('./components/DevTools'); // eslint-disable-line
  ReactDOM.render(
    <Provider store={store} key="provider">
      <DevTools />
    </Provider>,
    devToolsDest
  );
}
