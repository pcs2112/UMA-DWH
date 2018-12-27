import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import RedBox from 'redbox-react';
import createStore from './redux/create';
import { client } from './helpers/ApiClient';
import getRoutes from './routes';
import App from './routes/App';

const store = createStore(client, window.__data);

let render = (routes) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App routes={routes} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('content')
  );
};

// Support hot reloading of components and display an overlay for runtime errors.
if (__DEVELOPMENT__ && module.hot) {
  const renderApp = render;
  const renderError = (error) => {
    ReactDOM.render(
      <RedBox error={error} />,
      document.getElementById('content'),
    );
  };

  render = () => {
    try {
      const newRoutes = getRoutes(store);
      renderApp(newRoutes);
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./routes', () => {
    render();
  });
}

render(getRoutes(store));

if (!__DEVELOPMENT__) {
  window.React = React;
}
