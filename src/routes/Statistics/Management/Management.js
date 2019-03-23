import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { DEFAULT_DATE_FORMAT, STATISTICS_MANAGEMENT_REFRESH_TIMEOUT } from '../../../constants/index';
import statisticsManagementRdx from '../../../redux/modules/statisticsManagement';
import statisticsChartRdx from '../../../redux/modules/statisticsChart';
import statisticsSchemasRdx from '../../../redux/modules/statisticsSchemas';
import withMainLayout from '../../../components/WithMainLayout';
import globalCss from '../../../css/global';
import ManagementTable from './ManagementTable';
import DateChartFilter from '../DateChartFilter';
import DropdownFilters from '../DropdownFilters';

let initialTimeout = null;

class Management extends Component {
  static propTypes = {
    isStatisticsManagementFetching: PropTypes.bool.isRequired,
    statisticsManagementDataLoaded: PropTypes.bool.isRequired,
    statisticsManagementData: PropTypes.array.isRequired,
    statisticsManagementFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    statisticsManagementFilters: PropTypes.object.isRequired,
    statisticsManagementSelectedData: PropTypes.object.isRequired,
    statisticsManagementSelectedCount: PropTypes.number.isRequired,
    statisticsManagementQueuedSelectedData: PropTypes.array.isRequired,
    statisticsManagementDequeuedSelectedData: PropTypes.array.isRequired,
    schemas: PropTypes.array.isRequired,
    isStatisticsChartFetching: PropTypes.bool.isRequired,
    statisticsChartDataLoaded: PropTypes.bool.isRequired,
    statisticsChartData: PropTypes.array.isRequired,
    isQueuingStats: PropTypes.bool.isRequired,
    isDequeuingStats: PropTypes.bool.isRequired,
    dispatchPollingAction: PropTypes.func.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    fetchStatisticsManagementData: PropTypes.func.isRequired,
    fetchStatisticsChartData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired,
    queueStats: PropTypes.func.isRequired,
    dequeueStats: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, statisticsManagementFilters } = this.props;
    const { schema, date, months } = statisticsManagementFilters;
    fetchAllData(schema, date, months)
      .then(() => {
        this.startPolling();
      });
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    this.stopPolling();
    resetAllData();
  }

  resetChart = () => {
    const { fetchStatisticsChartData, statisticsManagementFilters } = this.props;
    const { schema, months } = statisticsManagementFilters;
    fetchStatisticsChartData(schema, moment().format(DEFAULT_DATE_FORMAT), months);
  };

  startPolling = () => {
    const { dispatchPollingAction } = this.props;
    if (initialTimeout) {
      clearTimeout(initialTimeout);
    }

    initialTimeout = setTimeout(() => {
      dispatchPollingAction(statisticsManagementRdx.actions.pollingActions.start(dispatchPollingAction));
    }, STATISTICS_MANAGEMENT_REFRESH_TIMEOUT);
  };

  stopPolling = () => {
    const { dispatchPollingAction } = this.props;
    if (initialTimeout) {
      clearTimeout(initialTimeout);
    }

    dispatchPollingAction(statisticsManagementRdx.actions.pollingActions.reset());
  };

  queueStats = () => {
    const { statisticsManagementDequeuedSelectedData, queueStats } = this.props;
    if (statisticsManagementDequeuedSelectedData.length > 0) {
      queueStats(statisticsManagementDequeuedSelectedData);
    }
  };

  dequeueStats = () => {
    const { statisticsManagementQueuedSelectedData, dequeueStats } = this.props;
    if (statisticsManagementQueuedSelectedData.length > 0) {
      dequeueStats(statisticsManagementQueuedSelectedData);
    }
  };

  selectAll = () => {
    const { selectAllData } = this.props;
    selectAllData();
  };

  render() {
    const {
      isStatisticsManagementFetching,
      statisticsManagementDataLoaded,
      statisticsManagementData,
      statisticsManagementFetchingError,
      statisticsManagementFilters,
      statisticsManagementSelectedData,
      statisticsManagementSelectedCount,
      statisticsManagementQueuedSelectedData,
      statisticsManagementDequeuedSelectedData,
      schemas,
      isStatisticsChartFetching,
      statisticsChartDataLoaded,
      statisticsChartData,
      fetchStatisticsChartData,
      isQueuingStats,
      isDequeuingStats,
      selectData,
      unselectData,
      unselectAllData
    } = this.props;

    const current = moment(statisticsManagementFilters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {__APP_TITLE__} - DWH Statistics Management{' '}
            ({current.format('MMM D, YYYY')})
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={11}>
              <DateChartFilter
                isFetching={isStatisticsChartFetching}
                dataLoaded={statisticsChartDataLoaded}
                data={statisticsChartData}
                onClick={fetchStatisticsChartData}
                {...statisticsManagementFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                schemas={schemas}
                onChange={fetchStatisticsChartData}
                {...statisticsManagementFilters}
              />
              <div className="right-aligned">
                <Button as={Link} to="/statistics/history">
                  View History
                </Button>
                <Button primary onClick={this.resetChart} disabled={today.isSame(current, 'day')}>
                  Reset Chart
                </Button>
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment style={globalCss.pageHeaderSegment}>
          <ManagementTable
            dataLoaded={statisticsManagementDataLoaded}
            data={statisticsManagementData}
            isFetching={isStatisticsManagementFetching}
            fetchingError={statisticsManagementFetchingError}
            selectedData={statisticsManagementSelectedData}
            selectData={selectData}
            unselectData={unselectData}
            isQueuingStats={isQueuingStats}
          />
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={statisticsManagementDequeuedSelectedData.length < 1 || isQueuingStats}
            loading={isQueuingStats}
            onClick={this.queueStats}
          >
            Queue stats
          </Button>
          <Button
            size="small"
            disabled={statisticsManagementQueuedSelectedData.length < 1 || isDequeuingStats}
            loading={isDequeuingStats}
            onClick={this.dequeueStats}
          >
            Dequeue stats
          </Button>
          {statisticsManagementSelectedCount > 0 && (
            <Button
              size="small"
              onClick={unselectAllData}
            >
              Uncheck All
            </Button>
          )}
          {statisticsManagementSelectedCount < 1 && (
            <Button
              size="small"
              onClick={this.selectAll}
            >
              Check All
            </Button>
          )}
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isStatisticsManagementFetching: state.statisticsManagement.isFetching,
    statisticsManagementDataLoaded: state.statisticsManagement.dataLoaded,
    statisticsManagementData: statisticsManagementRdx.selectors.getStatisticsManagement(state),
    statisticsManagementFetchingError: statisticsManagementRdx.selectors.getFetchingError(state),
    statisticsManagementFilters: statisticsChartRdx.selectors.getFilters(state),
    statisticsManagementSelectedData: statisticsManagementRdx.selectors.getSelected(state),
    statisticsManagementSelectedCount: statisticsManagementRdx.selectors.getSelectedCount(state),
    statisticsManagementQueuedSelectedData: statisticsManagementRdx.selectors.getQueuedSelected(state),
    statisticsManagementDequeuedSelectedData:
      statisticsManagementRdx.selectors.getDequeuedSelected(state),
    schemas: statisticsSchemasRdx.selectors.getSchemas(state),
    isStatisticsChartFetching: state.statisticsChart.isFetching,
    statisticsChartDataLoaded: state.statisticsChart.dataLoaded,
    statisticsChartData: statisticsChartRdx.selectors.getStatisticsChartData(state),
    isQueuingStats: state.statisticsManagement.isQueuingStats,
    isDequeuingStats: state.statisticsManagement.isDequeuingStats
  }),
  dispatch => ({
    dispatchPollingAction: dispatch,
    fetchAllData: (schema, date, months) =>
      Promise.all([
        dispatch(statisticsManagementRdx.actions.fetch()),
        dispatch(statisticsChartRdx.actions.fetch(schema, date, months))
      ]),
    fetchStatisticsManagementData: () =>
      dispatch(statisticsManagementRdx.actions.fetch()),
    fetchStatisticsChartData: (schema, date, months) =>
      dispatch(statisticsChartRdx.actions.fetch(schema, date, months)),
    resetAllData: () => {
      dispatch(statisticsManagementRdx.actions.reset());
      dispatch(statisticsChartRdx.actions.reset());
    },
    selectData: data => dispatch(statisticsManagementRdx.actions.select(data)),
    unselectData: (id, data) => dispatch(statisticsManagementRdx.actions.unselect(id, data)),
    selectAllData: () => dispatch(statisticsManagementRdx.actions.selectAll()),
    unselectAllData: () => dispatch(statisticsManagementRdx.actions.unselectAll()),
    queueStats: tables =>
      dispatch(statisticsManagementRdx.actions.queueStats(tables))
        .then(() => dispatch(statisticsManagementRdx.actions.fetch())),
    dequeueStats: tables =>
      dispatch(statisticsManagementRdx.actions.dequeueStats(tables))
        .then(() => dispatch(statisticsManagementRdx.actions.fetch()))
  })
)(Management));
