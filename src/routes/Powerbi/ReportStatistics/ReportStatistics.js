import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { getAllUrlParams } from 'javascript-utils/lib/url';
import config from 'config';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import powerbiReportStatistics from 'redux/modules/powerbiReportStatistics';
import ReportStatisticsTable from './ReportStatisticsTable';

class ReportStatistics extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    currentReportName: PropTypes.string.isRequired,
    isPowerbiReportStatisticsFetching: PropTypes.bool.isRequired,
    powerbiReportStatisticsDataLoaded: PropTypes.bool.isRequired,
    powerbiReportStatisticsData: PropTypes.array.isRequired,
    powerbiReportStatisticsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchPowerbiReportStatistics: PropTypes.func.isRequired,
    resetPowerbiReportStatistics: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { location: { search }, fetchPowerbiReportStatistics } = this.props;
    const queryParams = getAllUrlParams(search);
    fetchPowerbiReportStatistics(queryParams && queryParams.report ? queryParams.report : 'ALL');
  }

  componentWillUnmount() {
    this.props.resetPowerbiReportStatistics();
  }

  render() {
    const {
      currentReportName,
      isPowerbiReportStatisticsFetching,
      powerbiReportStatisticsDataLoaded,
      powerbiReportStatisticsData,
      powerbiReportStatisticsFetchingError
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - {(currentReportName === 'ALL' ? 'Power BI' : currentReportName)} Report Statistics
          </h1>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ReportStatisticsTable
            dataLoaded={powerbiReportStatisticsDataLoaded}
            data={powerbiReportStatisticsData}
            isFetching={isPowerbiReportStatisticsFetching}
            fetchingError={powerbiReportStatisticsFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    currentReportName: state.powerbiReportStatistics.reportName || 'ALL',
    isPowerbiReportStatisticsFetching: state.powerbiReportStatistics.isFetching,
    powerbiReportStatisticsDataLoaded: state.powerbiReportStatistics.dataLoaded,
    powerbiReportStatisticsData: powerbiReportStatistics.selectors.getPowerbiReportStatistics(state),
    powerbiReportStatisticsFetchingError: powerbiReportStatistics.selectors.getFetchingError(state)
  }),
  dispatch => ({
    fetchPowerbiReportStatistics: reportName =>
      dispatch(powerbiReportStatistics.actions.fetchPowerbiReportStatistics(reportName)),
    resetPowerbiReportStatistics: () => dispatch(powerbiReportStatistics.actions.reset())
  })
)(ReportStatistics));
