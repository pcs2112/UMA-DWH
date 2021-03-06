import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button, Message } from 'semantic-ui-react';
import { isEmpty } from 'javascript-utils/lib/utils';
import { TextField, CheckBoxField } from '../../../components/ReduxForm';
import FormError from '../../../components/FormError';
import { newReportTableValidator } from './validate';

class SaveReportTableForm extends Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    tableNameExistsError: PropTypes.bool,
    createdTableSchema: PropTypes.string.isRequired,
    createdTableName: PropTypes.string.isRequired,
    insertedRowCount: PropTypes.number.isRequired
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
      pristine,
      submitting,
      submitSucceeded,
      error,
      handleSubmit,
      onSubmit,
      onClose,
      createdTableSchema,
      createdTableName,
      insertedRowCount
    } = this.props;
    const { tableNameExistsError } = this.state;
    return (
      <Form
        onSubmit={handleSubmit(onSubmit)}
        autocomplete="off"
        disabled={submitSucceeded}
        success={submitSucceeded}
        error={!isEmpty(error)}
      >
        {submitSucceeded && (
          <Message
            success
            content={
              `[${createdTableSchema}].[${createdTableName}] with ${insertedRowCount} records was created successfully.`
            }
          />
        )}
        {error && <FormError error={error} />}
        <Field
          name="table_schema"
          type="text"
          component={TextField}
          label="Table Schema"
          required
          readOnly
        />
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
  validate: newReportTableValidator,
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
      tableNameExistsError: errors && errors.table_name === 'The table name already exists.',
      createdTableSchema: state.collegeScorecardReports.newTableSchema || '',
      createdTableName: state.collegeScorecardReports.newTableName || '',
      insertedRowCount: state.collegeScorecardReports.newReportRowCount || 0
    };
  }
)(connForm);
