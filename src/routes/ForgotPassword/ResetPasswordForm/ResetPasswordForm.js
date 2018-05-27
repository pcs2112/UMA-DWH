import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button, Divider } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import validate from './validate';

const ResetPasswordForm = ({
  pristine, submitting, onGoBack
}) => (
  <Fragment>
    <p>
      Enter your and confirm your new password.
    </p>
    <Field
      name="newPassword"
      type="password"
      component={TextField}
      label="New Password"
    />
    <Field
      name="confirmNewPassword"
      type="password"
      component={TextField}
      label="Confirm New Password"
    />
    <div className="field">
      <Button type="submit" fluid size="large" color="red" disabled={pristine || submitting}>
        Reset
      </Button>
    </div>
    <Divider section />
    <p className="center aligned text">
      Having trouble resetting your password?{' '}
      <a
        href="/"
        className="boldText"
        onClick={(event) => {
          event.preventDefault();
          onGoBack();
        }}
      >
        Try again
      </a>
    </p>
  </Fragment>
);

ResetPasswordForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  onGoBack: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'ResetPasswordForm',
  fields: ['newPassword', 'confirmNewPassword'],
  validate
})(withBasicForm(ResetPasswordForm));
