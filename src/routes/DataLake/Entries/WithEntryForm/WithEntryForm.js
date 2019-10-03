import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';
import withBasicForm from '../../../../components/WithBasicForm';
import { TextField, SelectField } from '../../../../components/ReduxForm';
import { newEntryValidator, existingEntryValidator } from './validate';

const dataRanges = [
  {
    key: 'yearly',
    value: 'yearly',
    text: 'Yearly'
  },
  {
    key: 'quaterly',
    value: 'quaterly',
    text: 'Quaterly'
  },
  {
    key: 'monthly',
    value: 'monthly',
    text: 'Monthly'
  },
  {
    key: 'weekly',
    value: 'weekly',
    text: 'Weekly'
  },
  {
    key: 'daily',
    value: 'daily',
    text: 'Daily'
  }
];

const dataFormats = [
  {
    key: 'csv',
    value: 'csv',
    text: 'CSV'
  },
  {
    key: 'text',
    value: 'text',
    text: 'Text'
  },
  {
    key: 'json',
    value: 'json',
    text: 'JSON'
  },
  {
    key: 'xml',
    value: 'xml',
    text: 'XML'
  }
];

const withEntryForm = (scenario = 'create') => {
  const WithEntryForm = ({
    pristine, submitting, submitSucceeded, onClose
  }) => (
    <Fragment>
      {submitSucceeded && (
        <Message
          success
          content="The entry was saved successfully."
        />
      )}
      <Field
        name="primary_source"
        type="text"
        component={TextField}
        label="Primary Source"
        required
      />
      <Field
        name="data_type"
        type="text"
        component={TextField}
        label="Data Type"
        required
      />
      <Form.Group widths="equal">
        <Field
          name="data_range"
          component={SelectField}
          label="Data Range"
          required
          options={dataRanges}
        />
        <Field
          name="data_format"
          component={SelectField}
          label="Data Format"
          required
          options={dataFormats}
        />
      </Form.Group>
      <Field
        name="url"
        type="text"
        component={TextField}
        label="URL"
        required
      />
      <Field
        name="data_lake_table"
        type="text"
        component={TextField}
        label="DataLake Table"
        required
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

  WithEntryForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  };

  let validate;
  if (scenario === 'create') {
    validate = newEntryValidator;
  } else {
    validate = existingEntryValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'primary_source',
      'data_type',
      'data_range',
      'data_format',
      'url',
      'data_lake_table'
    ]
  })(withBasicForm(WithEntryForm));
};

export default withEntryForm;
