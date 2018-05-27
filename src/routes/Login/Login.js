import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Segment } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import withGuestLayout from 'components/WithGuestLayout';
import LoginForm from './LoginForm';

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired
  };

  render() {
    const { onLogin, onLoginSuccess } = this.props;

    return (
      <Fragment>
        <Header as="h1" textAlign="center">
          Log-in to the UMA
        </Header>
        <Segment textAlign="left" color="grey">
          <LoginForm
            onSubmit={onLogin}
            onSubmitSuccess={onLoginSuccess}
          />
        </Segment>
      </Fragment>
    );
  }
}

export default withGuestLayout(connect(
  null,
  dispatch => ({
    onLogin: data => dispatch(userModule.actions.login(data)),
    onLoginSuccess: () => {
      dispatch(userModule.actions.fetchUser());
    }
  })
)(Login));
