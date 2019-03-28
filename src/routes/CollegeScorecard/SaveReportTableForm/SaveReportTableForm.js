import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { TextField } from '../../../components/ReduxForm';
import { newReportTableValidator } from './validate';

class SaveReportTableForm extends Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType[PropTypes.bool, PropTypes.string, PropTypes.object].isRequired
  };

  render() {
    const {
      pristine, submitting, error
    } = this.props;
    console.log(error);
    return (
      <Form>
        <Field
          name="table_name"
          type="text"
          component={TextField}
          label="Table Name"
          required
        />
        <Field
          name="table_schema"
          type="text"
          component={TextField}
          label="Table Schema"
          required
        />
        <div className="field">
          <Button type="submit" fluid size="large" primary disabled={pristine || submitting}>
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default reduxForm({
  newReportTableValidator,
  fields: [
    'report_id',
    'table_name',
    'table_schema'
  ]
})(SaveReportTableForm);
