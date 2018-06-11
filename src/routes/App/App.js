import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { reactRouterFetch } from 'javascript-utils/lib/react-router';
import { Dimmer, Loader } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import Error from 'routes/Error';
import NProgress from 'components/NProgress';

class App extends Component {
  static propTypes = {
    routes: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isInitialAppFetching: true,
      isAppFetching: false,
      appFetchingError: null
    };
  }

  componentDidMount() {
    NProgress.initialize();

    // Fetch User information
    this.props.fetchUser()
      .then(() => {
        // Load initial data
        this.fetchRoutes(this.props);
      })
      .catch(() => {
        this.setState({
          isInitialAppFetching: false
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const current = `${this.props.location.pathname}${this.props.location.search}`;
    const next = `${nextProps.location.pathname}${nextProps.location.search}`;
    if (current === next) {
      return;
    }

    this.fetchRoutes(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.isAppFetching;
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
    if (!this.state.isInitialAppFetching) {
      NProgress.enable();
    }
  }

  fetchRoutes(props) {
    const { location, routes } = props;

    NProgress.start();

    this.setState({
      isAppFetching: true
    }, () => {
      reactRouterFetch(routes, location)
        .then(() => {
          NProgress.done();

          this.setState({
            isInitialAppFetching: false,
            isAppFetching: false,
            appFetchingError: null
          });
        })
        .catch((err) => {
          NProgress.done();

          this.setState({
            isInitialAppFetching: false,
            isAppFetching: false,
            appFetchingError: err
          });
        });
    });
  }

  render() {
    const { routes } = this.props;
    const { isInitialAppFetching, isAppFetching, appFetchingError } = this.state;

    if (isInitialAppFetching || (isInitialAppFetching && isAppFetching)) {
      return (
        <Dimmer active inverted>
          <Loader size="large" />
        </Dimmer>
      );
    }

    if (appFetchingError) {
      if (appFetchingError.error_type !== 'JWT_ERROR' && appFetchingError.status_code !== 401) {
        return (
          <Error
            header={`${appFetchingError.status_code || 500} Error`}
            content={appFetchingError.message}
          />
        );
      }
    }

    return (
      <Fragment>
        {renderRoutes(routes)}
      </Fragment>
    );
  }
}

const connectedApp = connect(
  null,
  dispatch => ({
    fetchUser: () => dispatch(userModule.actions.fetchUser())
  })
)(App);

export default withRouter(connectedApp);
