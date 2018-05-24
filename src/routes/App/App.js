import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reactRouterFetch } from 'javascript-utils/lib/react-router';
import { Grid, Dimmer, Loader } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import MainMenu from 'components/MainMenu';
import NProgress from 'components/NProgress';
import Login from 'routes/Login';
import { mainContentCss } from './css';

class App extends Component {
  static propTypes = {
    routes: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
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
    if (this.state.appFetchingError) {
      console.warn(this.state.appFetchingError.message);
    }

    if (!this.state.isInitialAppFetching) {
      NProgress.enable();
    }
  }

  fetchRoutes(props) {
    const { location, routes } = props;

    NProgress.start();

    this.setState({
      isAppFetching: true
    });

    reactRouterFetch(routes, location)
      .then(() => {
        this.setState({
          isInitialAppFetching: false,
          isAppFetching: false,
          appFetchingError: null
        }, () => {
          NProgress.done();
        });
      })
      .catch((err) => {
        this.setState({
          isInitialAppFetching: false,
          isAppFetching: false,
          appFetchingError: err
        }, () => {
          NProgress.done();
        });
      });
  }

  render() {
    const {
      routes, location: { pathname }, isLoggedIn, onLogout
    } = this.props;
    const { isInitialAppFetching, isAppFetching } = this.state;

    if (isInitialAppFetching) {
      return (
        <Dimmer active inverted>
          <Loader size="large" />
        </Dimmer>
      );
    }

    // Redirect to the login route
    if (!isLoggedIn && pathname !== '/login') {
      return (<Redirect to="/login" />);
    }

    if (pathname === '/login') {
      // Redirect to home route
      if (isLoggedIn) {
        return (<Redirect to="/" />);
      }

      // Show login route
      return (<Login />);
    }

    return (
      <div>
        <MainMenu
          currentPathName={pathname}
          onLogout={onLogout}
        />
        <div style={mainContentCss}>
          {isAppFetching &&
            <Dimmer active inverted>
              <Loader size="large">Loading</Loader>
            </Dimmer>
          }
          <Grid>
            <Grid.Row>
              <Grid.Column>
                {renderRoutes(routes)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const connectedApp = connect(
  state => ({
    isLoggedIn: state.user.isLoggedIn
  }),
  dispatch => ({
    fetchUser: () => dispatch(userModule.actions.fetchUser()),
    onLogout: () => dispatch(userModule.actions.logout())
  })
)(App);

export default withRouter(connectedApp);
