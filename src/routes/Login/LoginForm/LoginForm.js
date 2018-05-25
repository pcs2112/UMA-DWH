import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { isEmpty } from 'helpers/utils';
import { TextField } from 'components/ReduxForm';
import FormError from 'components/FormError';
import validate from './validate';

const LoginForm = ({
  pristine, submitting, error, handleSubmit, onSubmit
}) => (
  <Form
    onSubmit={handleSubmit(onSubmit)}
    size="large"
    loading={submitting}
    error={!isEmpty(error)}
  >
    {error && <FormError error={error} />}
    <Field name="email" type="text" component={TextField} label="Email" required />
    <Field name="password" type="password" component={TextField} label="Password" required />
    <div className="field">
      <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
        Sign in
      </Button>
    </div>
  </Form>
);

LoginForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'LoginForm',
  fields: ['email', 'password'],
  validate
})(LoginForm);
