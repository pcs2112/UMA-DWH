import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Segment, Grid } from 'semantic-ui-react';
import { getAllUrlParams } from 'javascript-utils/lib/url';
import config from 'config';
import withMainLayout from 'components/WithMainLayout';
import CycleArrowPagination from 'components/CycleArrowPagination';
import globalCss from 'css/global';
import powerbiReportStatistics from 'redux/modules/powerbiReportStatistics';
import powerbiReportRuns from 'redux/modules/powerbiReportRuns';
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
          render={() => (<Redirect to="/powerbi/report/history" />)}
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
                nextDisabled={reportRunsData.length < 1}
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
    isReportStatisticsFetching: state.powerbiReportStatistics.isFetching,
    reportStatisticsDataLoaded: state.powerbiReportStatistics.dataLoaded,
    reportStatisticsData: powerbiReportStatistics.selectors.getPowerbiReportStatistics(state),
    reportStatisticsFetchingError: powerbiReportStatistics.selectors.getFetchingError(state),
    isReportRunsFetching: state.powerbiReportRuns.isFetching,
    reportRunsDataLoaded: state.powerbiReportRuns.dataLoaded,
    reportRunsData: powerbiReportRuns.selectors.getPowerbiReportRuns(state),
    reportRunsFetchingError: powerbiReportRuns.selectors.getFetchingError(state),
    reportRunsCurrentCycleGroup: powerbiReportRuns.selectors.getCurrentCycleGroup(state),
    reportRunsCurrentCycleGroupStartDttm: powerbiReportRuns.selectors.getCurrentCycleGroupStartDttm(state)
  }),
  dispatch => ({
    fetchReportStatistics: reportName =>
      dispatch(powerbiReportStatistics.actions.fetchPowerbiReportStatistics(reportName)),
    resetReportStatistics: () => dispatch(powerbiReportStatistics.actions.reset()),
    fetchReportRuns: reportName =>
      dispatch(powerbiReportRuns.actions.fetchPowerbiReportRuns(reportName)),
    fetchPrevReportRuns: () => dispatch(powerbiReportRuns.actions.fetchPrev()),
    fetchNextReportRuns: () => dispatch(powerbiReportRuns.actions.fetchNext()),
    resetReportRuns: () => dispatch(powerbiReportRuns.actions.reset())
  })
)(ReportStatistics));
