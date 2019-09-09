import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';
import withBasicForm from '../../../../components/WithBasicForm';
import { TextField, SelectField, TextAreaField } from '../../../../components/ReduxForm';
import { newCategoryValidator, existingCategoryValidator } from './validate';

const withCategoryForm = (scenario) => {
  const WithCategoryForm = ({
    pristine, submitting, submitSucceeded, files, tables, onClose
  }) => (
    <Fragment>
      {submitSucceeded && (
        <Message
          success
          content="The category was saved successfully."
        />
      )}
      <Form.Group widths="equal">
        <Field name="category_name" type="text" component={TextField} label="Category name" required />
        <Field
          name="csv_file"
          component={SelectField}
          label="CSV File"
          required
          options={files}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Field name="description" type="text" component={TextField} label="Description" required />
        <Field
          name="where_unit_id_table"
          component={SelectField}
          label="Table w/columns in formula"
          required
          options={tables}
        />
      </Form.Group>
      <Field name="formula" component={TextAreaField} label="Formula" required rows={10} />
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

  WithCategoryForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    files: PropTypes.array.isRequired,
    tables: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
  };

  let validate;
  if (scenario === 'create') {
    validate = newCategoryValidator;
  } else {
    validate = existingCategoryValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'category_id',
      'category_name',
      'description',
      'csv_file',
      'where_unit_id_table',
      'formula'
    ]
  })(withBasicForm(WithCategoryForm));
};

export default withCategoryForm;
