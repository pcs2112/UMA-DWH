import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form } from 'semantic-ui-react';
import { TextField, /* SelectField, */CheckBoxField } from '../../../components/ReduxForm';
import { cubeValidator } from './validation';

const checkboxStyle = {
  paddingTop: '1.75rem'
};

class CubeForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    // submitSucceeded: PropTypes.bool,
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
      >
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
            name="primary_fact_table"
            type="text"
            component={TextField}
            label="Primary Fact Table"
            required
            width="eight"
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
        <Form.Group>
          <Form.Button
            content="Define"
            disabled={definitionDisabled || submitting}
            onClick={onDefinition}
          />
          <Form.Button
            content="Schedule"
            disabled={scheduleDisabled || submitting}
            onClick={onSchedule}
          />
          <Form.Button
            content="Save"
            disabled={submitting}
          />
          <Form.Button
            content="Cancel"
            secondary
            onClick={onCancel}
            disabled={(isNewRecord && (pristine || submitting)) || (!isNewRecord && submitting)}
          />
        </Form.Group>
      </Form>
    );
  }
}

export default reduxForm({
  validate: cubeValidator,
  fields: [
    'cube_name',
    'active_flag',
    'primary_fact_table',
    'view_name',
    'table_name',
    'materialize',
    'cube_date_start',
    'cube_date_end'
  ]
})(CubeForm);
