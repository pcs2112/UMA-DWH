import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, Segment } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import LoginForm from './LoginForm';
import { mainGridStyles, mainColStyles } from './css';

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired
  };

  render() {
    const { onLogin, onLoginSuccess } = this.props;

    return (
      <Grid textAlign="center" verticalAlign="middle" style={mainGridStyles}>
        <Grid.Column style={mainColStyles}>
          <Header as="h1" textAlign="center">
            Log-in to the UMA
          </Header>
          <Segment textAlign="left" color="grey">
            <LoginForm
              onSubmit={onLogin}
              onSubmitSuccess={onLoginSuccess}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    onLogin: data => dispatch(userModule.actions.login(data)),
    onLoginSuccess: () => {
      dispatch(userModule.actions.fetchUser());
    }
  })
)(Login);
