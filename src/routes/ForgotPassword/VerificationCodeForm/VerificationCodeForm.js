import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button, Loader } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import validate from './validate';

const VerificationCodeForm = ({
  pristine, submitting, resending, email, onGoBack, onResendCode
}) => (
  <Fragment>
    <p>
      Check your email for the code. Enter it below.
    </p>
    <Field
      name="verification_code"
      type="tel"
      maxLength="6"
      component={TextField}
      placeholder="6-digit code"
    />
    <div className="field">
      <Button type="submit" fluid size="large" color="red" disabled={pristine || submitting}>
        Verify
      </Button>
    </div>
    <p>
      Enter the confirmation code we sent to {email}. If you didn't get it, we can {' '}
      <br />
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onResendCode();
        }}
      >
        resend the code
      </a>.{' '}{resending && <Loader active inline size="tiny" as="span" />}
    </p>
    <p>
      Didn't enter the right email address? {' '}
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onGoBack();
        }}
      >
        Change it
      </a>
    </p>
  </Fragment>
);

VerificationCodeForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  resending: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onResendCode: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'VerificationCodeForm',
  fields: ['verification_code'],
  validate
})(withBasicForm(VerificationCodeForm));
