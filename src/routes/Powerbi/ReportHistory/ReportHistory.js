import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import powerbiReportHistory from 'redux/modules/powerbiReportHistory';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import Filters from './Filters';
import ReportHistoryTable from './ReportHistoryTable';

const FILTERS_FORM_NAME = 'PowerBIReportHistoryFilters';

class ReportHistory extends Component {
  static propTypes = {
    isPowerbiReportHistoryFetching: PropTypes.bool.isRequired,
    powerbiReportHistoryDataLoaded: PropTypes.bool.isRequired,
    powerbiReportHistoryData: PropTypes.array.isRequired,
    powerbiReportHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    powerbiReportHistoryFilters: PropTypes.object.isRequired,
    fetchPowerbiReportHistory: PropTypes.func.isRequired,
    resetPowerbiReportHistory: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchPowerbiReportHistory, powerbiReportHistoryFilters, setFilters } = this.props;
    setFilters(powerbiReportHistoryFilters);
    fetchPowerbiReportHistory(powerbiReportHistoryFilters);
  }

  componentWillUnmount() {
    this.props.resetPowerbiReportHistory();
  }

  render() {
    const {
      isPowerbiReportHistoryFetching,
      powerbiReportHistoryDataLoaded,
      powerbiReportHistoryData,
      powerbiReportHistoryFetchingError,
      fetchPowerbiReportHistory,
      resetFilters
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Power BI Report History
          </h1>
        </Segment>
        <Segment>
          <Filters
            form={FILTERS_FORM_NAME}
            onSubmit={fetchPowerbiReportHistory}
            onCancel={resetFilters}
          />
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ReportHistoryTable
            dataLoaded={powerbiReportHistoryDataLoaded}
            data={powerbiReportHistoryData}
            isFetching={isPowerbiReportHistoryFetching}
            fetchingError={powerbiReportHistoryFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isPowerbiReportHistoryFetching: state.powerbiReportHistory.isFetching,
    powerbiReportHistoryDataLoaded: state.powerbiReportHistory.dataLoaded,
    powerbiReportHistoryData: powerbiReportHistory.selectors.getPowerbiReportHistory(state),
    powerbiReportHistoryFetchingError: powerbiReportHistory.selectors.getFetchingError(state),
    powerbiReportHistoryFilters: powerbiReportHistory.selectors.getFilters(state)
  }),
  dispatch => ({
    fetchPowerbiReportHistory: (data) => {
      if (data) {
        return dispatch(powerbiReportHistory.actions.fetchPowerbiReportHistory(
          data.start_date,
          data.end_date
        ));
      }

      return dispatch(powerbiReportHistory.actions.fetchPowerbiReportHistory());
    },
    resetPowerbiReportHistory: () => dispatch(powerbiReportHistory.actions.reset()),
    setFilters: (data) => {
      dispatch(change(FILTERS_FORM_NAME, 'start_date', data.start_date));
      dispatch(change(FILTERS_FORM_NAME, 'end_date', data.end_date));
    },
    resetFilters: () => {
      dispatch(reset(FILTERS_FORM_NAME));
      dispatch(powerbiReportHistory.actions.fetchPowerbiReportHistory());
    }
  })
)(ReportHistory));
