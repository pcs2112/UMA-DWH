import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormSyncErrors } from 'redux-form';
import { Form, Message } from 'semantic-ui-react';
import _ from 'lodash';
import { isEmpty } from 'javascript-utils/lib/utils';
import { TextField, /* SelectField, */CheckBoxField } from '../../../components/ReduxForm';
import FormError from '../../../components/FormError';
import { cubeValidator } from './validation';

const checkboxStyle = {
  paddingTop: '1.75rem'
};

class CubeForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
    submitSucceeded: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isNewRecord: PropTypes.bool.isRequired,
    definitionDisabled: PropTypes.bool.isRequired,
    onDefinition: PropTypes.func.isRequired,
    scheduleDisabled: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  render() {
    const {
      submitting,
      pristine,
      submitFailed,
      error,
      submitSucceeded,
      handleSubmit,
      onSubmit,
      isNewRecord,
      scheduleDisabled,
      definitionDisabled,
      onDefinition,
      onSchedule,
      onCancel
    } = this.props;
    return (
      <Form
        size="small"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        error={submitFailed && !isEmpty(error)}
        success={submitSucceeded}
      >
        {submitFailed && error && <FormError error={error} />}
        {submitSucceeded && (
          <Message
            success
            content="The cube was saved successfully."
          />
        )}
        <Form.Group>
          <Field
            name="cube_name"
            type="text"
            component={TextField}
            label="Cube Name"
            required
            width="eight"
          />
          <Field
            name="active_flag"
            component={CheckBoxField}
            label="Active"
            width="four"
            style={checkboxStyle}
          />
        </Form.Group>
        <Form.Group>
          <Field
            name="view_name"
            type="text"
            component={TextField}
            label="View Name"
            required
            width="four"
          />
          <Field
            name="table_name"
            type="text"
            component={TextField}
            label="Table Name"
            required
            width="four"
          />
          <Field
            name="materialize"
            component={CheckBoxField}
            label="Materialize"
            width="four"
            style={checkboxStyle}
          />
        </Form.Group>
        <Form.Group>
          <Field
            name="cube_date_start"
            type="date"
            component={TextField}
            label="Start Date"
            required
            width="four"
          />
          <Field
            name="cube_date_end"
            type="date"
            component={TextField}
            label="End Date"
            required
            width="four"
          />
        </Form.Group>
        <Field name="definition" type="hidden" component="input" />
        <Form.Group>
          <Form.Button
            type="button"
            content="Define"
            disabled={definitionDisabled || submitting || submitSucceeded}
            onClick={onDefinition}
          />
          <Form.Button
            type="button"
            content="Schedule"
            disabled={scheduleDisabled || submitting || submitSucceeded}
            onClick={onSchedule}
          />
          <Form.Button
            content="Save"
            disabled={submitting || submitSucceeded}
          />
          <Form.Button
            type="button"
            content={submitSucceeded ? 'Reset' : 'Cancel'}
            secondary
            onClick={onCancel}
            disabled={(isNewRecord && (pristine || submitting)) || (!isNewRecord && submitting)}
          />
        </Form.Group>
      </Form>
    );
  }
}

const ConnectedForm = connect(
  (state, props) => ({
    error: _.has(getFormSyncErrors(props.form)(state), 'definition') ? 'The definition must be set.' : undefined
  })
)(CubeForm);

export default reduxForm({
  validate: cubeValidator,
  fields: [
    'cube_name',
    'active_flag',
    'view_name',
    'table_name',
    'materialize',
    'cube_date_start',
    'cube_date_end',
    'definition'
  ]
})(ConnectedForm);
