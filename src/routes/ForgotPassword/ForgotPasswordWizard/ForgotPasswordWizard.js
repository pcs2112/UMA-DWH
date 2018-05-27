import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';
import { Message, Icon } from 'semantic-ui-react';
import {
  FORGOT_PASSWORD_SCENARIO,
  FORGOT_PASSWORD_VERIFICATION_CODE_SCENARIO,
  FORGOT_PASSWORD_RESET_SCENARIO,
  FORGOT_PASSWORD_SUCCESS_SCENARIO
} from 'constants/index';
import { getFormFieldValue } from 'helpers/redux';
import ForgotPasswordForm from '../ForgotPasswordForm';
import VerificationCodeForm from '../VerificationCodeForm';
import ResetPasswordForm from '../ResetPasswordForm';

class ForgotPasswordWizard extends Component {
  static propTypes = {
    formName: PropTypes.string.isRequired,
    formSize: PropTypes.string,
    email: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onGoToLogin: PropTypes.func.isRequired,
    destroyFormState: PropTypes.func.isRequired
  };

  static defaultProps = {
    formSize: 'large'
  };

  constructor(props) {
    super(props);
    this.state = {
      currentStepNumber: FORGOT_PASSWORD_SCENARIO,
      resendingCode: false
    };

    this.goToStep = this.goToStep.bind(this);
  }

  componentWillUnmount() {
    this.props.destroyFormState();
  }

  goToStep(step) {
    this.setState({
      currentStepNumber: step
    });
  }

  renderStep(stepNumber) {
    switch (stepNumber) {
      case FORGOT_PASSWORD_VERIFICATION_CODE_SCENARIO:
        return this.renderVerificationCodeForm();
      case FORGOT_PASSWORD_RESET_SCENARIO:
        return this.renderResetPasswordForm();
      case FORGOT_PASSWORD_SUCCESS_SCENARIO:
        return (
          <div>
            <Message
              icon
              success
            >
              <Icon name="checkmark" />
              <Message.Content>
                <Message.Header>Success!!!</Message.Header>
                <p>
                  <a
                    href="/login"
                    onClick={(event) => {
                      event.preventDefault();
                      this.props.onGoToLogin();
                    }}
                  >
                    Click here to login using your new password
                  </a>.
                </p>
              </Message.Content>
            </Message>
          </div>
        );
      default:
        return this.renderForgotPasswordForm();
    }
  }

  renderForgotPasswordForm() {
    const {
      formName, formSize, onSubmit, onGoToLogin
    } = this.props;
    return (
      <ForgotPasswordForm
        form={formName}
        formSize={formSize}
        formButtonSize={formSize}
        onSubmit={data => onSubmit(data, FORGOT_PASSWORD_SCENARIO)}
        onSubmitSuccess={() => this.goToStep(FORGOT_PASSWORD_VERIFICATION_CODE_SCENARIO)}
        onGoToLogin={onGoToLogin}
        destroyOnUnmount={false}
        forceUnregisterOnUnmount
      />
    );
  }

  renderVerificationCodeForm() {
    const {
      formName, formSize, email, onSubmit, destroyFormState
    } = this.props;

    const { resendingCode } = this.state;

    return (
      <VerificationCodeForm
        form={formName}
        formSize={formSize}
        resending={resendingCode}
        email={email}
        formButtonSize={formSize}
        onSubmit={data => onSubmit(data, FORGOT_PASSWORD_VERIFICATION_CODE_SCENARIO)}
        onSubmitSuccess={() => this.goToStep(FORGOT_PASSWORD_RESET_SCENARIO)}
        onGoBack={() => {
          destroyFormState();
          this.goToStep(FORGOT_PASSWORD_SCENARIO);
        }}
        onResendCode={() => {
          this.setState({
            resendingCode: true
          }, () => {
            onSubmit({ email }, FORGOT_PASSWORD_SCENARIO)
              .then(() => {
                this.setState({
                  resendingCode: false
                });
              });
          });
        }}
        destroyOnUnmount={false}
        forceUnregisterOnUnmount
      />
    );
  }

  renderResetPasswordForm() {
    const {
      formName, formSize, onSubmit, destroyFormState
    } = this.props;
    return (
      <ResetPasswordForm
        form={formName}
        formSize={formSize}
        formButtonSize={formSize}
        onSubmit={data => onSubmit(data, FORGOT_PASSWORD_RESET_SCENARIO)}
        onSubmitSuccess={() => this.goToStep(FORGOT_PASSWORD_SUCCESS_SCENARIO)}
        onGoBack={() => {
          destroyFormState();
          this.goToStep(FORGOT_PASSWORD_SCENARIO);
        }}
        destroyOnUnmount={false}
        forceUnregisterOnUnmount
      />
    );
  }

  render() {
    const { currentStepNumber } = this.state;
    return (
      <Fragment>
        {this.renderStep(currentStepNumber)}
      </Fragment>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    email: getFormFieldValue(state.form[ownProps.formName], 'email')
  }),
  (dispatch, ownProps) => ({
    destroyFormState: () => {
      dispatch(destroy(ownProps.formName));
    }
  })
)(ForgotPasswordWizard);
