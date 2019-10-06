import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form } from 'semantic-ui-react';
import { TextField, SelectField, CheckBoxField } from '../../../components/ReduxForm';

const checkboxStyle = {
  paddingTop: '1.75rem'
};

const scheduleTypes = [
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

class CubeForm extends Component {
  /* static propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  }; */

  render() {
    return (
      <Form
        size="small"
      >
        <Form.Group>
          <Field
            name="cube_name"
            type="text"
            component={TextField}
            label="Cube Name"
            required
            width={8}
          />
          <Field
            name="active_date"
            type="text"
            component={TextField}
            label="Active Date"
            required
            width={4}
          />
        </Form.Group>
        <Form.Group>
          <Field
            name="schedule_type"
            component={SelectField}
            label="Schedule Type"
            required
            options={scheduleTypes}
            width={8}
          />
          <Field
            name="multi_fact"
            component={CheckBoxField}
            label="Multi-Fact"
            width={4}
            style={checkboxStyle}
          />
        </Form.Group>
        <Form.Group>
          <Field
            name="primary_fact_table"
            type="text"
            component={TextField}
            label="View/Table Name"
            required
            width={8}
          />
          <Field
            name="materialize"
            component={CheckBoxField}
            label="Materialize"
            width={4}
            style={checkboxStyle}
          />
        </Form.Group>
      </Form>
    );
  }
}

export default reduxForm({
  fields: [
    'cube_name',
    'active',
    'schedule_type',
    'multi_fact',
    'materialize',
    'primary_fact_table'
  ]
})(CubeForm);
