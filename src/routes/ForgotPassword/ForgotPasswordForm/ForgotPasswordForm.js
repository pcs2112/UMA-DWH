import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { Button, Divider } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import validate from './validate';

const ForgotPasswordForm = ({
  pristine, submitting, onGoToLogin
}) => (
  <Fragment>
    <p>
      Enter the email address associated with your account, and we'll email you a code to reset your password.
    </p>
    <Field name="email" type="text" component={TextField} label="Email Address" required />
    <div className="field">
      <Button type="submit" fluid size="large" color="red" disabled={pristine || submitting}>
        Send Reset Code
      </Button>
    </div>
    <Divider section />
    <p className="centered-aligned">
      Have an account?{' '}
      <Link
        to="/login"
        onClick={(event) => {
          event.preventDefault();
          onGoToLogin();
        }}
      >
        Back to login
      </Link>
    </p>
  </Fragment>
);

ForgotPasswordForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  onGoToLogin: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'ForgotPasswordForm',
  fields: ['email'],
  validate
})(withBasicForm(ForgotPasswordForm));
