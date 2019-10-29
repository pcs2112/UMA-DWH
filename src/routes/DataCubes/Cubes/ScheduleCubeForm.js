import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm, Field, change, reset, resetSection
} from 'redux-form';
import { Form, Header } from 'semantic-ui-react';
import _ from 'lodash';
import {
  TextField, CheckBoxField, SelectField
} from '../../../components/ReduxForm';
import { scheduleValidator } from './validation';

const checkboxStyle = {
  paddingTop: '1.75rem'
};

const frequencyOptions = [
  {
    key: 'daily',
    value: 'daily',
    text: 'Daily'
  },
  {
    key: 'weekly',
    value: 'weekly',
    text: 'Weekly'
  }
];

class ScheduleCubeForm extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    form: PropTypes.string.isRequired,
    values: PropTypes.object,
    onDone: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onClose: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeDailyFrequency: PropTypes.func.isRequired
  };

  handleDailyFrequency = (e, { value }) => {
    const { onChangeDailyFrequency } = this.props;
    onChangeDailyFrequency(parseInt(value, 10));
  }

  handleDone = () => {
    const { values, onDone } = this.props;
    onDone(values);
  }

  render() {
    const {
      values,
      onCancel
    } = this.props;
    return (
      <Form
        size="small"
        autoComplete="off"
      >
        <Form.Group>
          <Field
            name="name"
            type="text"
            component={TextField}
            label="Name"
            required
            width="eight"
          />
          <Field
            name="active_flag"
            component={CheckBoxField}
            label="Enabled"
            width="four"
            style={checkboxStyle}
          />
        </Form.Group>
        <Header as="h4" dividing>Frequency</Header>
        <Field
          name="frequency"
          component={SelectField}
          label="Occurs"
          required
          options={frequencyOptions}
          width="four"
        />
        {_.get(values, 'frequency') === 'weekly' && (
          <>
            <Form.Group>
              <Field
                name="monday"
                component={CheckBoxField}
                label="Monday"
                width="two"
                style={checkboxStyle}
              />
              <Field
                name="tuesday"
                component={CheckBoxField}
                label="Tuesday"
                width="two"
                style={checkboxStyle}
              />
              <Field
                name="wednesday"
                component={CheckBoxField}
                label="Wednesday"
                width="two"
                style={checkboxStyle}
              />
              <Field
                name="thursday"
                component={CheckBoxField}
                label="Thursday"
                width="two"
                style={checkboxStyle}
              />
            </Form.Group>
            <Form.Group>
              <Field
                name="friday"
                component={CheckBoxField}
                label="Friday"
                width="two"
                style={checkboxStyle}
              />
              <Field
                name="saturday"
                component={CheckBoxField}
                label="Saturday"
                width="two"
                style={checkboxStyle}
              />
              <Field
                name="sunday"
                component={CheckBoxField}
                label="Sunday"
                width="two"
                style={checkboxStyle}
              />
            </Form.Group>
          </>
        )}
        <Header as="h4" dividing>Daily Frequency</Header>
        <Form.Group inline>
          <Form.Radio
            label="Occurs once at"
            value="1"
            checked={_.get(values, 'daily_frequency') === 1}
            onChange={this.handleDailyFrequency}
            width="two"
          />
          <Field
            name="daily_start"
            type="time"
            component={TextField}
            label=""
            width="three"
            disabled={_.get(values, 'daily_frequency') === 0}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Radio
            label="Occurs every&nbsp;&nbsp;&nbsp;"
            value="0"
            checked={_.get(values, 'daily_frequency') === 0}
            onChange={this.handleDailyFrequency}
            width="two"
          />
          <Field
            name="daily_occurs_interval"
            type="number"
            component={TextField}
            label=""
            width="two"
            disabled={_.get(values, 'daily_frequency') === 1}
            min={1}
            max={12}
          />
          <div className="two wide field">
            <label>hour(s)</label>
          </div>
          <Field
            name="daily_start"
            type="date"
            component={TextField}
            label="Starting"
            width="four"
            disabled={_.get(values, 'daily_frequency') === 1}
          />
        </Form.Group>
        <Form.Group inline>
          <div className="six wide field" />
          <Field
            name="daily_end"
            type="date"
            component={TextField}
            label="Ending&nbsp;&nbsp;"
            width="four"
            disabled={_.get(values, 'daily_frequency') === 1}
          />
        </Form.Group>
        <Header as="h4" dividing>Duration</Header>
        <Form.Group>
          <Field
            name="duration_start"
            type="date"
            component={TextField}
            label="Start Date"
            width="five"
          />
          <Field
            name="duration_end"
            type="date"
            component={TextField}
            label="End Date"
            width="five"
          />
        </Form.Group>
        <Form.Group>
          <Form.Button
            type="button"
            content="Done"
            primary
            onClick={this.handleDone}
          />
          <Form.Button
            type="button"
            content="Cancel"
            onClick={onCancel}
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
    onChangeDailyFrequency: (value) => dispatch(change(props.form, 'daily_frequency', value)),
    onDone: (schedule) => {
      props.onClose();
      dispatch(change(props.form.replace('Schedule', ''), 'schedule', schedule));
    },
    onCancel: () => {
      props.onClose();
      dispatch(reset(props.form));
      dispatch(resetSection(props.form.replace('Schedule', ''), 'schedule'));
    }
  })
)(ScheduleCubeForm);

export default reduxForm({
  validate: scheduleValidator,
  fields: [
    'name',
    'active_flag',
    'frequency',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'daily_frequency',
    'daily_occurs_interval',
    'daily_start',
    'daily_end',
    'duration_start',
    'duration_end'
  ]
})(ConnectedForm);
