import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { getAllUrlParams } from 'javascript-utils/lib/url';
import config from 'config';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import powerbiReportStatistics from 'redux/modules/powerbiReportStatistics';
import powerbiReportRuns from 'redux/modules/powerbiReportRuns';
import ReportStatisticsTable from './ReportStatisticsTable';
import ReportRunsTable from './ReportRunsTable';

class ReportStatistics extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isPowerbiReportStatisticsFetching: PropTypes.bool.isRequired,
    powerbiReportStatisticsDataLoaded: PropTypes.bool.isRequired,
    powerbiReportStatisticsData: PropTypes.array.isRequired,
    powerbiReportStatisticsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchPowerbiReportStatistics: PropTypes.func.isRequired,
    resetPowerbiReportStatistics: PropTypes.func.isRequired,
    isPowerbiReportRunsFetching: PropTypes.bool.isRequired,
    powerbiReportRunsDataLoaded: PropTypes.bool.isRequired,
    powerbiReportRunsData: PropTypes.array.isRequired,
    powerbiReportRunsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchPowerbiReportRuns: PropTypes.func.isRequired,
    resetPowerbiReportRuns: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { location: { search }, fetchPowerbiReportStatistics, fetchPowerbiReportRuns } = this.props;
    const queryParams = getAllUrlParams(search);
    if (queryParams && queryParams.report) {
      fetchPowerbiReportStatistics(queryParams.report);
      fetchPowerbiReportRuns(queryParams.report);
    }
  }

  componentWillUnmount() {
    this.props.resetPowerbiReportStatistics();
    this.props.resetPowerbiReportRuns();
  }

  render() {
    const {
      location,
      isPowerbiReportStatisticsFetching,
      powerbiReportStatisticsDataLoaded,
      powerbiReportStatisticsData,
      powerbiReportStatisticsFetchingError,
      isPowerbiReportRunsFetching,
      powerbiReportRunsDataLoaded,
      powerbiReportRunsData,
      powerbiReportRunsFetchingError
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
          dataLoaded={powerbiReportStatisticsDataLoaded}
          data={powerbiReportStatisticsData}
          isFetching={isPowerbiReportStatisticsFetching}
          fetchingError={powerbiReportStatisticsFetchingError}
        />
        <Segment style={globalCss.pageHeaderSegment}>
          <ReportRunsTable
            dataLoaded={powerbiReportRunsDataLoaded}
            data={powerbiReportRunsData}
            isFetching={isPowerbiReportRunsFetching}
            fetchingError={powerbiReportRunsFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isPowerbiReportStatisticsFetching: state.powerbiReportStatistics.isFetching,
    powerbiReportStatisticsDataLoaded: state.powerbiReportStatistics.dataLoaded,
    powerbiReportStatisticsData: powerbiReportStatistics.selectors.getPowerbiReportStatistics(state),
    powerbiReportStatisticsFetchingError: powerbiReportStatistics.selectors.getFetchingError(state),
    isPowerbiReportRunsFetching: state.powerbiReportRuns.isFetching,
    powerbiReportRunsDataLoaded: state.powerbiReportRuns.dataLoaded,
    powerbiReportRunsData: powerbiReportRuns.selectors.getPowerbiReportRuns(state),
    powerbiReportRunsFetchingError: powerbiReportRuns.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchPowerbiReportStatistics: reportName =>
      dispatch(powerbiReportStatistics.actions.fetchPowerbiReportStatistics(reportName)),
    resetPowerbiReportStatistics: () => dispatch(powerbiReportStatistics.actions.reset()),
    fetchPowerbiReportRuns: reportName =>
      dispatch(powerbiReportRuns.actions.fetchPowerbiReportRuns(reportName)),
    resetPowerbiReportRuns: () => dispatch(powerbiReportRuns.actions.reset())
  })
)(ReportStatistics));
