import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { FilePathField, TextAreaField } from 'components/ReduxForm';
import { newFileValidator, existingFileValidator } from './validate';

const withFileForm = (scenario) => {
  const WithFileForm = ({
    pristine, submitting
  }) => (
    <Fragment>
      <Field
        component={FilePathField}
        name="file_path_filename"
        label="File"
        required
        accept=".doc,.docx"
      />
      <Field
        component={TextAreaField}
        name="description"
        type="text"
        label="Description"
        required
      />
      <div className="field">
        <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
          Submit
        </Button>
      </div>
    </Fragment>
  );

  WithFileForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool
  };

  let validate;
  if (scenario === 'create') {
    validate = newFileValidator;
  } else {
    validate = existingFileValidator;
  }

  return reduxForm({
    validate,
    fields: [
      'file_path_filename',
      'description',
    ]
  })(withBasicForm(WithFileForm));
};

export default withFileForm;
