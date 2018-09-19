import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import config from 'config';
import reportHistory from 'redux/modules/reportHistory';
import reportRuntimeChart from 'redux/modules/reportRuntimeChart';
import reportsReduxModule from 'redux/modules/reports';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import HistoryTable from './HistoryTable';
import DateChartFilter from './DateChartFilter';
import DropdownFilters from './DropdownFilters';
import { DEFAULT_DATE_FORMAT } from '../../constants';

class Reports extends Component {
  static propTypes = {
    isReportHistoryFetching: PropTypes.bool.isRequired,
    reportHistoryDataLoaded: PropTypes.bool.isRequired,
    reportHistoryData: PropTypes.array.isRequired,
    reportHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    reportHistoryFilters: PropTypes.object.isRequired,
    reports: PropTypes.array.isRequired,
    isReportRuntimeChartFetching: PropTypes.bool.isRequired,
    reportRuntimeChartDataLoaded: PropTypes.bool.isRequired,
    reportRuntimeChartData: PropTypes.array.isRequired,
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
      reportHistoryFetchingError,
      reportHistoryFilters,
      reports,
      isReportRuntimeChartFetching,
      reportRuntimeChartDataLoaded,
      reportRuntimeChartData,
      fetchAllData
    } = this.props;

    const current = moment(reportHistoryFilters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Report History{' '}
            ({current.format('MMM D, YYYY')})
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={11}>
              <DateChartFilter
                isFetching={isReportRuntimeChartFetching}
                dataLoaded={reportRuntimeChartDataLoaded}
                data={reportRuntimeChartData}
                onClick={fetchAllData}
                {...reportHistoryFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                reports={reports}
                onChange={fetchAllData}
                {...reportHistoryFilters}
              />
              <div className="right-aligned">
                <Button primary onClick={this.resetChart} disabled={today.isSame(current, 'day')}>
                  Reset Chart
                </Button>
              </div>
            </Grid.Column>
          </Grid>
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
    reportHistoryFilters: reportHistory.selectors.getFilters(state),
    reports: reportsReduxModule.selectors.getReports(state),
    isReportRuntimeChartFetching: state.reportRuntimeChart.isFetching,
    reportRuntimeChartDataLoaded: state.reportRuntimeChart.dataLoaded,
    reportRuntimeChartData: reportRuntimeChart.selectors.getReportRuntimeChartData(state)
  }),
  dispatch => ({
    fetchAllData: (reportName, date, months) =>
      Promise.all([
        dispatch(reportsReduxModule.actions.fetch(date)),
        dispatch(reportHistory.actions.fetchReportHistory(reportName, date, months)),
        dispatch(reportRuntimeChart.actions.fetch(reportName, date, months))
      ]),
    resetAllData: () => {
      dispatch(reportHistory.actions.reset());
      dispatch(reportRuntimeChart.actions.reset());
    }
  })
)(Reports));
