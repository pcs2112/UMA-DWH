import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Segment, Grid, Button } from 'semantic-ui-react';
import tasksRdx from '../../../redux/modules/collegeScorecard/tasks';
import withMainLayout from '../../../components/WithMainLayout';
import ListTable from './ListTable';
import ScheduleTaskForm from './ScheduleTaskForm';
import globalCss from '../../../css/global';

class Tasks extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    fetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    dispatchPollingAction: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.startPolling();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  startPolling = () => {
    const { dispatchPollingAction } = this.props;
    this.pollingActions = tasksRdx.actions.getPollingActions();
    dispatchPollingAction(this.pollingActions.start(dispatchPollingAction));
  };

  stopPolling = () => {
    const { dispatchPollingAction } = this.props;
    dispatchPollingAction(this.pollingActions.reset());
  };

  render() {
    const {
      isFetching,
      dataLoaded,
      data,
      fetchingError,
    } = this.props;
    return (
      <Fragment>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            College Scorecard - Queued History
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <ScheduleTaskForm />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ListTable
            isFetching={isFetching}
            dataLoaded={dataLoaded}
            data={data}
            fetchingError={fetchingError}
          />
        </Segment>
        <Segment>
          <Button
            size="small"
            as={Link}
            to="/college_scorecard/reporting"
          >
            Reporting
          </Button>
        </Segment>
      </Fragment>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isFetching: state.collegeScorecardTasks.isFetching,
    dataLoaded: state.collegeScorecardTasks.dataLoaded,
    data: tasksRdx.selectors.getData(state),
    fetchingError: tasksRdx.selectors.getFetchingError(state),
  }),
  dispatch => ({
    dispatchPollingAction: dispatch,
  })
)(Tasks));
