import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm, Field, getFormSyncErrors, FormSection
} from 'redux-form';
import { Form, Message } from 'semantic-ui-react';
import _ from 'lodash';
import { isEmpty } from 'javascript-utils/lib/utils';
import { TextField, CheckBoxField } from '../../../components/ReduxForm';
import FormError from '../../../components/FormError';
import { cubeValidator } from './validation';

const checkboxStyle = {
  paddingTop: '1.75rem'
};

class CubeForm extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    form: PropTypes.string.isRequired,
    values: PropTypes.object,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
    internalError: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    definitionDisabled: PropTypes.bool.isRequired,
    onDefinition: PropTypes.func.isRequired,
    scheduleDisabled: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired
  };

  render() {
    const {
      values,
      pristine,
      submitting,
      submitSucceeded,
      submitFailed,
      error,
      internalError,
      handleSubmit,
      onSubmit,
      onCancel,
      scheduleDisabled,
      definitionDisabled,
      onDefinition,
      onSchedule
    } = this.props;
    return (
      <Form
        size="small"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        error={!isEmpty(error) || (submitFailed && !isEmpty(internalError))}
        success={submitSucceeded}
        disabled={submitSucceeded}
      >
        {(error || internalError) && <FormError error={error || internalError} />}
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
            required={_.get(values, 'materialize', false)}
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
            width="four"
          />
        </Form.Group>
        <Field name="definition" type="hidden" component="input" />
        <FormSection name="schedule">
          <Field name="name" type="hidden" component="input" />
        </FormSection>
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
            disabled={pristine || submitting || submitSucceeded}
          />
          <Form.Button
            type="button"
            content={submitSucceeded ? 'Reset' : 'Cancel'}
            secondary
            onClick={onCancel}
            disabled={submitting}
          />
        </Form.Group>
      </Form>
    );
  }
}

const ConnectedForm = connect(
  (state, props) => {
    const errors = getFormSyncErrors(props.form)(state);
    let error;
    if (_.has(errors, 'definition')) {
      error = 'The definition must be set.';
    } else if (_.has(errors, 'schedule')) {
      error = 'The schedule must be set.';
    }

    return {
      values: _.get(state, `form.${props.form}.values`, {}),
      internalError: error
    };
  }
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
    'definition',
    'schedule.name'
  ]
})(ConnectedForm);
