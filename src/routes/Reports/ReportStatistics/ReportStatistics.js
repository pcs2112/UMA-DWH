import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Segment, Grid } from 'semantic-ui-react';
import { getAllUrlParams } from 'javascript-utils/lib/url';
import config from 'config';
import { CYCLE_GROUP_PAGE_SIZE } from 'constants/index';
import withMainLayout from 'components/WithMainLayout';
import CycleArrowPagination from 'components/CycleArrowPagination';
import globalCss from 'css/global';
import reportStatistics from 'redux/modules/reportStatistics';
import reportRuns from 'redux/modules/reportRuns';
import ReportStatisticsTable from './ReportStatisticsTable';
import ReportRunsTable from './ReportRunsTable';

class ReportStatistics extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isReportStatisticsFetching: PropTypes.bool.isRequired,
    reportStatisticsDataLoaded: PropTypes.bool.isRequired,
    reportStatisticsData: PropTypes.array.isRequired,
    reportStatisticsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchReportStatistics: PropTypes.func.isRequired,
    resetReportStatistics: PropTypes.func.isRequired,
    isReportRunsFetching: PropTypes.bool.isRequired,
    reportRunsDataLoaded: PropTypes.bool.isRequired,
    reportRunsData: PropTypes.array.isRequired,
    reportRunsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    reportRunsCurrentCycleGroup: PropTypes.number.isRequired,
    reportRunsCurrentCycleGroupStartDttm: PropTypes.string.isRequired,
    fetchReportRuns: PropTypes.func.isRequired,
    fetchPrevReportRuns: PropTypes.func.isRequired,
    fetchNextReportRuns: PropTypes.func.isRequired,
    resetReportRuns: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { location: { search }, fetchReportStatistics, fetchReportRuns } = this.props;
    const queryParams = getAllUrlParams(search);
    if (queryParams && queryParams.report) {
      fetchReportStatistics(queryParams.report);
      fetchReportRuns(queryParams.report);
    }
  }

  componentWillUnmount() {
    this.props.resetReportStatistics();
    this.props.resetReportRuns();
  }

  render() {
    const {
      location,
      isReportStatisticsFetching,
      reportStatisticsDataLoaded,
      reportStatisticsData,
      reportStatisticsFetchingError,
      isReportRunsFetching,
      reportRunsDataLoaded,
      reportRunsData,
      reportRunsFetchingError,
      reportRunsCurrentCycleGroup,
      reportRunsCurrentCycleGroupStartDttm,
      fetchPrevReportRuns,
      fetchNextReportRuns
    } = this.props;

    const queryParams = getAllUrlParams(location.search);

    if (!queryParams || !queryParams.report) {
      return (
        <Route
          render={() => (<Redirect to="/report/history" />)}
        />
      );
    }

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - {queryParams.report} Report
            Statistics
          </h1>
        </Segment>
        <ReportStatisticsTable
          dataLoaded={reportStatisticsDataLoaded}
          data={reportStatisticsData}
          isFetching={isReportStatisticsFetching}
          fetchingError={reportStatisticsFetchingError}
        />
        <Segment style={globalCss.pageHeaderSegment}>
          <ReportRunsTable
            dataLoaded={reportRunsDataLoaded}
            data={reportRunsData}
            isFetching={isReportRunsFetching}
            fetchingError={reportRunsFetchingError}
          />
        </Segment>
        <Segment>
          <Grid centered columns={2}>
            <Grid.Column>
              <CycleArrowPagination
                fetchPrev={fetchPrevReportRuns}
                fetchNext={fetchNextReportRuns}
                prevDisabled={reportRunsCurrentCycleGroup < 1}
                nextDisabled={reportRunsData.length <= CYCLE_GROUP_PAGE_SIZE}
                cycleGroup={reportRunsCurrentCycleGroup}
                cycleGroupStartDttm={reportRunsCurrentCycleGroupStartDttm}
                cycleGroupStartDttmLabel="Start DTTM"
              />
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isReportStatisticsFetching: state.reportStatistics.isFetching,
    reportStatisticsDataLoaded: state.reportStatistics.dataLoaded,
    reportStatisticsData: reportStatistics.selectors.getReportStatistics(state),
    reportStatisticsFetchingError: reportStatistics.selectors.getFetchingError(state),
    isReportRunsFetching: state.reportRuns.isFetching,
    reportRunsDataLoaded: state.reportRuns.dataLoaded,
    reportRunsData: reportRuns.selectors.getReportRuns(state),
    reportRunsFetchingError: reportRuns.selectors.getFetchingError(state),
    reportRunsCurrentCycleGroup: reportRuns.selectors.getCurrentCycleGroup(state),
    reportRunsCurrentCycleGroupStartDttm: reportRuns.selectors.getCurrentCycleGroupStartDttm(state)
  }),
  dispatch => ({
    fetchReportStatistics: reportName =>
      dispatch(reportStatistics.actions.fetchReportStatistics(reportName)),
    resetReportStatistics: () => dispatch(reportStatistics.actions.reset()),
    fetchReportRuns: reportName =>
      dispatch(reportRuns.actions.fetchReportRuns(reportName)),
    fetchPrevReportRuns: () => dispatch(reportRuns.actions.fetchPrev()),
    fetchNextReportRuns: () => dispatch(reportRuns.actions.fetchNext()),
    resetReportRuns: () => dispatch(reportRuns.actions.reset())
  })
)(ReportStatistics));
