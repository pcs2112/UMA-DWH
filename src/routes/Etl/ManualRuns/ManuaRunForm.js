import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm, Field, change, reset
} from 'redux-form';
import { Form, Message } from 'semantic-ui-react';
import _ from 'lodash';
import { isEmpty } from 'javascript-utils/lib/utils';
import manualRunsRdx from '../../../redux/modules/etl/manualRuns';
import { TextField } from '../../../components/ReduxForm';
import FormError from '../../../components/FormError';
import { manualRunValidator } from './validation';

class ManualRunForm extends Component {
  static propTypes = {
    form: PropTypes.string.isRequired, // eslint-disable-line
    values: PropTypes.object,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired
  };

  render() {
    const {
      values,
      pristine,
      submitting,
      submitSucceeded,
      error,
      handleSubmit,
      onSubmit,
      onCancel,
      onChangeStatus
    } = this.props;
    return (
      <Form
        size="small"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        error={!isEmpty(error)}
        success={submitSucceeded}
        disabled={submitSucceeded}
      >
        {error && <FormError error={error} />}
        {submitSucceeded && (
          <Message
            success
            content="The form was submitted successfully."
          />
        )}
        <Field
          name="stored_procedure"
          type="text"
          component={TextField}
          label="Procedure Name"
          required
          width="eight"
        />
        <div className="required field">
          <label>New Status</label>
        </div>
        <Form.Radio
          label="Schedule"
          value="SCHEDULE"
          checked={_.get(values, 'status') === 'SCHEDULE'}
          onChange={onChangeStatus}
        />
        <Form.Radio
          label="Cancel"
          value="CANCEL"
          checked={_.get(values, 'status') === 'CANCEL'}
          onChange={onChangeStatus}
        />
        <Form.Group>
          <Field
            name="from_dttm"
            type="datetime-local"
            component={TextField}
            label="From DTTM"
            required
            width="four"
          />
          <Field
            name="to_dttm"
            type="datetime-local"
            component={TextField}
            label="To DTTM"
            required
            width="four"
          />
        </Form.Group>
        <Form.Group width="eight">
          <Form.Button
            content="Enter"
            disabled={pristine || submitting || submitSucceeded}
          />
          <Form.Button
            type="button"
            content="Clear"
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
  (state, props) => ({
    values: _.get(state, `form.${props.form}.values`, {})
  }),
  (dispatch, props) => ({
    onChangeStatus: (e, { value }) => {
      dispatch(change(props.form, 'status', value));
      if (value === 'SCHEDULE') {
        dispatch(change(props.form, 'run_request', 'NEXT'));
      } else if (value === 'CANCEL') {
        dispatch(change(props.form, 'run_request', 'CANCEL'));
      }
    },
    onSubmit: (data) => dispatch(manualRunsRdx.actions.save(data)),
    onCancel: () => {
      dispatch(manualRunsRdx.actions.updatingEnd());
      dispatch(reset(props.form));
    }
  })
)(ManualRunForm);

export default reduxForm({
  validate: manualRunValidator,
  fields: [
    'stored_procedure',
    'status',
    'run_request',
    'from_dttm',
    'to_dttm'
  ],
  onSubmitSuccess: (result, dispatch) => {
    dispatch(manualRunsRdx.actions.updatingEnd());
    dispatch(manualRunsRdx.actions.fetch());
  }
})(ConnectedForm);
