import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Segment } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import withGuestLayout from 'components/WithGuestLayout';
import ForgotPasswordWizard from './ForgotPasswordWizard';

const FORM_NAME = 'ForgotPasswordWizard';

class ForgotPassword extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onGoToLogin: PropTypes.func.isRequired
  };

  render() {
    const { onSubmit, onGoToLogin } = this.props;

    return (
      <Fragment>
        <Header as="h1" textAlign="center">
          Forgot Password Reset
        </Header>
        <Segment textAlign="left" color="grey">
          <ForgotPasswordWizard
            formName={FORM_NAME}
            onSubmit={onSubmit}
            onGoToLogin={onGoToLogin}
          />
        </Segment>
      </Fragment>
    );
  }
}

export default withGuestLayout(connect(
  null,
  (dispatch, ownProps) => ({
    onSubmit: (data, scenario) => dispatch(userModule.actions.forgotPassword(data, scenario)),
    onGoToLogin: () => {
      ownProps.history.push('/login');
    }
  })
)(ForgotPassword));
