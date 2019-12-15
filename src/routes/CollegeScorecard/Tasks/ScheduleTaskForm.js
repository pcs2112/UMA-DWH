import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Dropdown, Button } from 'semantic-ui-react';
import { toast } from 'react-semantic-toasts';
import { isEmpty } from 'javascript-utils/lib/utils';
import tasksRdx from '../../../redux/modules/collegeScorecard/tasks';

const files = [
  'Data.yaml',
  'FieldOfStudyData1415_1516_PP.csv',
  'FieldOfStudyData1516_1617_PP.csv',
  'MERGED1996_97_PP.csv',
  'MERGED1997_98_PP.csv',
  'MERGED1998_99_PP.csv',
  'MERGED1999_00_PP.csv',
  'MERGED2000_01_PP.csv',
  'MERGED2001_02_PP.csv',
  'MERGED2002_03_PP.csv',
  'MERGED2003_04_PP.csv',
  'MERGED2004_05_PP.csv',
  'MERGED2005_06_PP.csv',
  'MERGED2006_07_PP.csv',
  'MERGED2007_08_PP.csv',
  'MERGED2008_09_PP.csv',
  'MERGED2010_11_PP.csv',
  'MERGED2011_12_PP.csv',
  'MERGED2012_13_PP.csv',
  'MERGED2013_14_PP.csv',
  'MERGED2014_15_PP.csv',
  'MERGED2015_16_PP.csv',
  'MERGED2016_17_PP.csv',
  'MERGED2017_18_PP.csv',
];

const options = [
  {
    key: '-1',
    value: '',
    text: 'Select One',
  },
];

files.forEach((file) => {
  options.push({
    key: file,
    value: file,
    text: file,
  });
});

class ScheduleTaskForm extends Component {
  static propTypes = {
    isScheduling: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired,
  };

  state = {
    value: '',
  }

  onChange = (e, { value }) => {
    this.setState({
      value,
    });
  }

  onSchedule = () => {
    const { value } = this.state;
    if (!isEmpty(value)) {
      const { onSchedule } = this.props;
      onSchedule(value);
    }
  }

  render() {
    const { isScheduling } = this.props;
    const { value } = this.state;
    return (
      <Form size="small">
        <Form.Group inline>
          <Form.Field width={8}>
            <Dropdown
              fluid
              selectOnNavigation={false}
              selection
              name="false"
              options={options}
              onChange={this.onChange}
              value={isEmpty(value) ? '' : value}
              disabled={isScheduling}
              placeholder="Select One"
            />
          </Form.Field>
          <Form.Field width={4}>
            <Button
              size="small"
              disabled={isScheduling}
              onClick={this.onSchedule}
              primary
            >
              Schedule Task
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default connect(
  (state) => ({
    isScheduling: state.collegeScorecardTasks.isScheduling,
  }),
  (dispatch) => ({
    onSchedule: (filename) => dispatch(tasksRdx.actions.scheduleTask({ filename }))
      .then(() => {
        toast(
          {
            type: 'success',
            title: 'Thank you',
            description: <p>The task was scheduled successfully.</p>,
            time: 5000
          }
        );

        return dispatch(tasksRdx.actions.fetch());
      })
      .catch((err) => {
        toast(
          {
            type: 'error',
            title: 'Error',
            description: <p>The task could not be scheduled.</p>,
            time: 5000
          }
        );
        return err;
      }),
  })
)(ScheduleTaskForm);
