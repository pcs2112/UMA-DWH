import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import validate from './validate';

const LoginForm = ({
  pristine, submitting
}) => (
  <Fragment>
    <Field name="email" type="text" component={TextField} label="Email" required />
    <Field name="password" type="password" component={TextField} label="Password" required />
    <div className="field">
      <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
        Sign in
      </Button>
    </div>
  </Fragment>
);

LoginForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool
};

export default reduxForm({
  form: 'LoginForm',
  fields: ['email', 'password'],
  validate
})(withBasicForm(LoginForm));
