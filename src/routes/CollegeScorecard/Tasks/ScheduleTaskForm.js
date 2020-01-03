import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, Dropdown, Button, Label
} from 'semantic-ui-react';
import { toast } from 'react-semantic-toasts';
import { isEmpty } from 'javascript-utils/lib/utils';
import tasksRdx from '../../../redux/modules/collegeScorecard/tasks';

const files = [
  'Most Recent Institution-Level Data',
  'Most Recent Data by Field of Study',
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

const shouldProvideFilename = (value) => value.includes('Institution-Level') || value.includes('Field of Study');

const initialState = {
  selectedFilename: '',
  newFilename: '',
  newFilenameError: '',
};

class ScheduleTaskForm extends Component {
  static propTypes = {
    isScheduling: PropTypes.bool.isRequired,
    onSchedule: PropTypes.func.isRequired,
  };

  state = {
    ...initialState,
  }

  onSelectedFilenameChange = (e, { value }) => {
    this.setState({
      selectedFilename: value,
      newFilename: value.includes('Institution-Level') ? 'MERGED' : 'FieldOfStudyData',
      newFilenameError: '',
    });
  }

  onFilenameChange = (e) => {
    this.setState({
      newFilename: e.target.value,
      newFilenameError: '',
    });
  }

  onSchedule = () => {
    const { selectedFilename, newFilename } = this.state;
    if (!isEmpty(selectedFilename)) {
      const { onSchedule } = this.props;
      if (!shouldProvideFilename(selectedFilename)) {
        onSchedule(selectedFilename, '');
      } else if (!isEmpty(newFilename)) {
        if (selectedFilename.includes('Institution-Level') && !newFilename.startsWith('MERGED')) {
          this.setState({
            newFilenameError: 'Filename must begin with "MERGED"',
          });
        } else if (selectedFilename.includes('Field of Study') && !newFilename.startsWith('FieldOfStudyData')) {
          this.setState({
            newFilenameError: 'Filename must begin with "FieldOfStudyData"',
          });
        } else {
          onSchedule(selectedFilename, newFilename);
        }
      }
    }
  }

  onReset = () => {
    this.setState({
      ...initialState,
    });
  }

  render() {
    const { isScheduling } = this.props;
    const { selectedFilename, newFilename, newFilenameError } = this.state;
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
              onChange={this.onSelectedFilenameChange}
              value={isEmpty(selectedFilename) ? '' : selectedFilename}
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
            <Button
              size="small"
              disabled={isScheduling}
              onClick={this.onReset}
            >
              Reset
            </Button>
          </Form.Field>
        </Form.Group>
        {shouldProvideFilename(selectedFilename) && (
          <>
            <Form.Group inline>
              <Form.Field
                width={8}
                error={!!(newFilenameError)}
                required
              >
                <input placeholder="Filename" onChange={this.onFilenameChange} value={newFilename} />
              </Form.Field>
            </Form.Group>
            {newFilenameError && (
              <Form.Group>
                <Form.Field
                  width={8}
                  error={!!(newFilenameError)}
                >
                  <Label basic color="red">
                    {newFilenameError}
                  </Label>
                </Form.Field>
              </Form.Group>
            )}
          </>
        )}
      </Form>
    );
  }
}

export default connect(
  (state) => ({
    isScheduling: state.collegeScorecardTasks.isScheduling,
  }),
  (dispatch) => ({
    onSchedule: (filename, newFilename) => dispatch(tasksRdx.actions.scheduleTask({
      filename,
      new_filename: newFilename,
    }))
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
