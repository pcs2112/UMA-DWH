import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import { sleep } from 'javascript-utils/lib/utils';
import { FILTERS_EXEC_DELAY } from 'constants/index';
import reportHistory from 'redux/modules/ReportHistory';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import Filters from './Filters';
import ReportHistoryTable from './ReportHistoryTable';

const FILTERS_FORM_NAME = 'ReportHistoryFilters';

class ReportHistory extends Component {
  static propTypes = {
    isReportHistoryFetching: PropTypes.bool.isRequired,
    reportHistoryDataLoaded: PropTypes.bool.isRequired,
    reportHistoryData: PropTypes.array.isRequired,
    reportHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    reportHistoryFilters: PropTypes.object.isRequired,
    fetchReportHistory: PropTypes.func.isRequired,
    resetReportHistory: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchReportHistory, reportHistoryFilters, setFilters } = this.props;
    setFilters(reportHistoryFilters);
    fetchReportHistory(reportHistoryFilters);
  }

  componentWillUnmount() {
    this.props.resetReportHistory();
  }

  render() {
    const {
      isReportHistoryFetching,
      reportHistoryDataLoaded,
      reportHistoryData,
      reportHistoryFetchingError,
      fetchReportHistory,
      resetFilters
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Report History
          </h1>
        </Segment>
        <Segment>
          <Filters
            form={FILTERS_FORM_NAME}
            onSubmit={fetchReportHistory}
            onCancel={resetFilters}
          />
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ReportHistoryTable
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
    fetchReportHistory: data => sleep(FILTERS_EXEC_DELAY)
      .then(() => {
        if (data) {
          return dispatch(reportHistory.actions.fetchReportHistory(
            data.start_date,
            data.end_date
          ));
        }

        return dispatch(reportHistory.actions.fetchReportHistory());
      }),
    resetReportHistory: () => dispatch(reportHistory.actions.reset()),
    setFilters: (data) => {
      dispatch(change(FILTERS_FORM_NAME, 'start_date', data.start_date));
      dispatch(change(FILTERS_FORM_NAME, 'end_date', data.end_date));
    },
    resetFilters: () => {
      dispatch(reset(FILTERS_FORM_NAME));
      sleep(FILTERS_EXEC_DELAY)
        .then(() => {
          dispatch(reportHistory.actions.fetchReportHistory());
        });
    }
  })
)(ReportHistory));
