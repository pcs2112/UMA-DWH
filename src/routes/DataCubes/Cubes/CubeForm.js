import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm, Field, getFormSyncErrors, FormSection, reset
} from 'redux-form';
import { Form } from 'semantic-ui-react';
import { toast } from 'react-semantic-toasts';
import _ from 'lodash';
import { isEmpty } from 'javascript-utils/lib/utils';
import cubesRdx from '../../../redux/modules/dataCubes/cubes';
import factsRdx from '../../../redux/modules/dataCubes/facts';
import dimsRdx from '../../../redux/modules/dataCubes/dims';
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
      >
        {(error || internalError) && <FormError error={error || internalError} />}
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
            required={_.get(values, 'materalize', false)}
            width="four"
          />
          <Field
            name="materalize"
            component={CheckBoxField}
            label="Materalize"
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
            disabled={definitionDisabled || submitting}
            onClick={onDefinition}
          />
          <Form.Button
            type="button"
            content="Schedule"
            disabled={scheduleDisabled || submitting}
            onClick={onSchedule}
          />
          <Form.Button
            content="Save"
            disabled={pristine || submitting}
          />
          <Form.Button
            type="button"
            content="Cancel"
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
  },
  (dispatch, props) => ({
    onSubmit: (data) => {
      console.log(data);
      return dispatch(cubesRdx.actions.save(data));
    },
    onCancel: () => {
      dispatch(cubesRdx.actions.updatingEnd());
      dispatch(reset(props.form));
      dispatch(reset(`Schedule${props.form}`));
      dispatch(dimsRdx.actions.unselectAll());
      dispatch(factsRdx.actions.unselectAll());
    }
  })
)(CubeForm);

export default reduxForm({
  validate: cubeValidator,
  fields: [
    'cube_name',
    'active_flag',
    'view_name',
    'table_name',
    'materalize',
    'cube_date_start',
    'cube_date_end',
    'definition',
    'schedule.name'
  ],
  onSubmitSuccess: (res, dispatch) => {
    dispatch(cubesRdx.actions.updatingEnd());
    dispatch(dimsRdx.actions.unselectAll());
    dispatch(factsRdx.actions.unselectAll());
    toast(
      {
        type: 'success',
        title: 'Thank you',
        description: <p>The cube was saved successfully.</p>,
        time: 5000
      }
    );
  }
})(ConnectedForm);
