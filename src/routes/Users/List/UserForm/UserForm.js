import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { isEmpty } from 'helpers/utils';
import { TextField } from 'components/ReduxForm';
import FormError from 'components/FormError';

const UserForm = ({
  pristine, submitting, error, handleSubmit, onSubmit
}) => (
  <Form
    onSubmit={handleSubmit(onSubmit)}
    size="small"
    loading={submitting}
    error={!isEmpty(error)}
  >
    {error && <FormError error={error} />}
    <Field name="employee_first_name" type="text" component={TextField} label="First Name" required />
    <Field name="employee_last_name" type="text" component={TextField} label="Last Name" required />
    <Field name="employee_email" type="text" component={TextField} label="Email" required />
    <Field name="employee_phone" type="text" component={TextField} label="Phone" />
    <Field name="employee_cell_phone" type="text" component={TextField} label="Cell Phone" />
    <Field name="employee_password" type="password" component={TextField} label="Password" />
    <div className="field">
      <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
        Submit
      </Button>
    </div>
  </Form>
);

UserForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  fields: [
    'employee_first_name',
    'employee_last_name',
    'employee_email',
    'employee_phone',
    'employee_cell_phone',
    'employee_password'
  ]
})(UserForm);
