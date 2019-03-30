import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button, Message } from 'semantic-ui-react';
import { TextField, CheckBoxField } from '../../../components/ReduxForm';
import { newReportTableValidator } from './validate';

class SaveReportTableForm extends Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    tableNameExistsError: PropTypes.bool
  };

  static defaultProps = {
    tableNameExistsError: false
  };

  constructor(props) {
    super(props);
    const { tableNameExistsError } = this.props;
    this.state = {
      tableNameExistsError
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tableNameExistsError && !state.tableNameExistsError) {
      return {
        tableNameExistsError: true
      };
    }

    if (props.pristine && state.tableNameExistsError) {
      return null;
    }

    return {
      tableNameExistsError: false
    };
  }

  render() {
    const {
      pristine, submitting, submitSucceeded, handleSubmit, onSubmit, onClose
    } = this.props;
    const { tableNameExistsError } = this.state;
    return (
      <Form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        disabled={submitSucceeded}
        success={submitSucceeded}
      >
        {submitSucceeded && (
          <Message
            success
            content="The table was created successfully."
          />
        )}
        <Field
          name="table_name"
          type="text"
          component={TextField}
          label="Table Name"
          required
        />
        {tableNameExistsError && (
          <Field
            name="overwrite"
            component={CheckBoxField}
            label="Check to overwrite the existing table"
          />
        )}
        <Field
          name="table_schema"
          type="text"
          component={TextField}
          label="Table Schema"
          required
        />
        <div className="field">
          {!submitSucceeded && (
            <Button
              type="submit"
              fluid
              size="large"
              primary
              disabled={pristine || submitting || submitSucceeded}
            >
              Submit
            </Button>
          )}
          {submitSucceeded && (
            <Button
              type="submit"
              fluid
              size="large"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </Form>
    );
  }
}

const connForm = reduxForm({
  newReportTableValidator,
  fields: [
    'report_id',
    'table_name',
    'table_schema',
    'overwrite'
  ]
})(SaveReportTableForm);

export default connect(
  (state, { form }) => {
    const errors = getFormSubmitErrors(form)(state);
    return {
      tableNameExistsError: errors && errors.table_name === 'The table name already exists.'
    };
  }
)(connForm);
