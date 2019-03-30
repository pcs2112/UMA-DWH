import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button, Message } from 'semantic-ui-react';
import withBasicForm from '../../../../components/WithBasicForm';
import { TextField } from '../../../../components/ReduxForm';
import { newUserValidator, existingUserValidator } from './validate';

const withUserForm = (scenario) => {
  const WithUserForm = ({
    pristine, submitting, submitSucceeded, onClose
  }) => (
    <Fragment>
      {submitSucceeded && (
        <Message
          success
          content="The user account was saved successfully."
        />
      )}
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
      <Field name="employee_cellphone" type="text" component={TextField} label="Cell Phone" />
      <Field
        name="employee_password"
        type="password"
        component={TextField}
        label="Password"
        required={scenario === 'create'}
      />
      <div className="field">
        {!submitSucceeded && (
          <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
            Submit
          </Button>
        )}
        {submitSucceeded && (
          <Button fluid size="large" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </Fragment>
  );

  WithUserForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  };

  let validate;
  if (scenario === 'create') {
    validate = newUserValidator;
  } else {
    validate = existingUserValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'employee_first_name',
      'employee_last_name',
      'employee_email',
      'employee_phone',
      'employee_cellphone',
      'employee_password'
    ]
  })(withBasicForm(WithUserForm));
};

export default withUserForm;
