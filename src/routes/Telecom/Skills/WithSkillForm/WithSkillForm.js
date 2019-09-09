import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';
import withBasicForm from '../../../../components/WithBasicForm';
import { TextField, SelectField } from '../../../../components/ReduxForm';
import { existingSkillValidator } from './validate';

const withSkillForm = () => {
  const WithSkillForm = ({
    pristine, submitting, submitSucceeded, updateTypes, onClose
  }) => (
    <Fragment>
      {submitSucceeded && (
        <Message
          success
          content="The skill was saved successfully."
        />
      )}
      <Form.Group widths="equal">
        <Field
          name="skill_name"
          type="text"
          component={TextField}
          label="Skill Name"
          required
          readOnly
        />
        <Field
          name="skill_update_type"
          component={SelectField}
          label="Skill Update Type"
          required
          options={updateTypes}
        />
      </Form.Group>
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

  WithSkillForm.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    updateTypes: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
  };

  return reduxForm({
    validate: existingSkillValidator,
    fields: [
      'skill_id',
      'skill_update_type'
    ]
  })(withBasicForm(WithSkillForm));
};

export default withSkillForm;
