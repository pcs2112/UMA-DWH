import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import { newUserValidator, existingUserValidator } from './validate';

const withUserForm = (scenario) => {
  const WithUserForm = ({
    pristine, submitting
  }) => (
    <Fragment>
      <Field name="employee_first_name" type="text" component={TextField} label="First Name" required />
      <Field name="employee_last_name" type="text" component={TextField} label="Last Name" required />
      <Field
        name="employee_email"
        type="text"
        component={TextField}
        label="Email"
        required
        readOnly={scenario !== 'create'}
      />
      <Field name="employee_phone" type="text" component={TextField} label="Phone" />
      <Field name="employee_cell_phone" type="text" component={TextField} label="Cell Phone" />
      <Field
        name="employee_password"
        type="password"
        component={TextField}
        label="Password"
        autoComplete="new-password"
        required={scenario === 'create'}
      />
      <div className="field">
        <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
          Submit
        </Button>
      </div>
    </Fragment>
  );

  WithUserForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool
  };

  let validate;
  if (scenario === 'create') {
    validate = existingUserValidator;
  } else {
    validate = newUserValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'employee_first_name',
      'employee_last_name',
      'employee_email',
      'employee_phone',
      'employee_cell_phone',
      'employee_password'
    ]
  })(withBasicForm(WithUserForm));
};

export default withUserForm;
