import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import withBasicForm from '../../../components/WithBasicForm';
import { TextField, TextAreaField } from '../../../components/ReduxForm';
import { newReportValidator, existingReportValidator } from './validate';

const withReportForm = (scenario) => {
  const WithReportForm = ({
    pristine, submitting
  }) => (
    <Fragment>
      <Field name="report_name" type="text" component={TextField} label="Report Name" required />
      <Field name="report_descrip" component={TextAreaField} label="Report Description" required />
      <Field name="share_dttm" type="date" component={TextField} label="Share Until" required />
      <div className="field">
        <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
          Submit
        </Button>
      </div>
    </Fragment>
  );

  WithReportForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool
  };

  let validate;
  if (scenario === 'create') {
    validate = newReportValidator;
  } else {
    validate = existingReportValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'report_name',
      'report_descrip',
      'share_dttm'
    ]
  })(withBasicForm(WithReportForm));
};

export default withReportForm;
