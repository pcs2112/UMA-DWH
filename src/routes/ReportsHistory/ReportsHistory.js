import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import reportHistory from 'redux/modules/reportHistory';
import reportRuntimeChart from 'redux/modules/reportRuntimeChart';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import HistoryTable from './HistoryTable';

class Reports extends Component {
  static propTypes = {
    isReportHistoryFetching: PropTypes.bool.isRequired,
    reportHistoryDataLoaded: PropTypes.bool.isRequired,
    reportHistoryData: PropTypes.array.isRequired,
    reportHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    reportHistoryFilters: PropTypes.object.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, reportHistoryFilters } = this.props;
    const { reportName, date, months } = reportHistoryFilters;
    fetchAllData(reportName, date, months);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  render() {
    const {
      isReportHistoryFetching,
      reportHistoryDataLoaded,
      reportHistoryData,
      reportHistoryFetchingError
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Report History
          </h1>
        </Segment>
        <Segment>
          test filters
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <HistoryTable
            dataLoaded={reportHistoryDataLoaded}
            data={reportHistoryData}
            isFetching={isReportHistoryFetching}
            fetchingError={reportHistoryFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isReportHistoryFetching: state.reportHistory.isFetching,
    reportHistoryDataLoaded: state.reportHistory.dataLoaded,
    reportHistoryData: reportHistory.selectors.getReportHistory(state),
    reportHistoryFetchingError: reportHistory.selectors.getFetchingError(state),
    reportHistoryFilters: reportHistory.selectors.getFilters(state)
  }),
  dispatch => ({
    fetchAllData: (reportName, date, months) =>
      Promise.all([
        dispatch(reportHistory.actions.fetchReportHistory(reportName, date, months)),
        dispatch(reportRuntimeChart.actions.fetch(reportName, date, months))
      ]),
    resetAllData: () => {
      dispatch(reportHistory.actions.reset());
      dispatch(reportRuntimeChart.actions.reset());
    }
  })
)(Reports));
