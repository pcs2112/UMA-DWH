import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import withBasicForm from 'components/WithBasicForm';
import { TextField } from 'components/ReduxForm';
import validate from './validate';

class Filters extends Component {
  static propTypes = {
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired
  };

  render() {
    const { pristine, submitting, onCancel } = this.props;
    return (
      <Fragment>
        <Form.Group>
          <Field
            component={TextField}
            type="date"
            name="start_date"
            label="Start Date"
            width="three"
          />
          <Field
            component={TextField}
            type="date"
            name="end_date"
            label="End Date"
            width="three"
          />
          <div className="three wide field">
            <label>&nbsp;</label>
            <Button type="submit" primary disabled={pristine || submitting}>
              Submit
            </Button>
            <Button type="button" disabled={pristine || submitting} onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form.Group>
      </Fragment>
    );
  }
}

export default reduxForm({
  form: 'PowerbiReportHistoryFilters',
  validate
})(withBasicForm(Filters));
