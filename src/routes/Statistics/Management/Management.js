import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { DEFAULT_DATE_FORMAT, STATISTICS_MANAGEMENT_REFRESH_TIMEOUT } from 'constants/index';
import config from 'config';
import statisticsManagementReduxModule from 'redux/modules/statisticsManagement';
import statisticsChartReduxModule from 'redux/modules/statisticsChart';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
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
    schemas: PropTypes.array.isRequired,
    isStatisticsChartFetching: PropTypes.bool.isRequired,
    statisticsChartDataLoaded: PropTypes.bool.isRequired,
    statisticsChartData: PropTypes.array.isRequired,
    isRunningStats: PropTypes.bool.isRequired,
    dispatchPollingAction: PropTypes.func.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    fetchStatisticsManagementData: PropTypes.func.isRequired,
    fetchStatisticsChartData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired,
    selectAllData: PropTypes.func.isRequired,
    unselectAllData: PropTypes.func.isRequired,
    runStats: PropTypes.func.isRequired
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
      dispatchPollingAction(statisticsManagementReduxModule.actions.pollingActions.start(dispatchPollingAction));
    }, STATISTICS_MANAGEMENT_REFRESH_TIMEOUT);
  };

  stopPolling = () => {
    const { dispatchPollingAction } = this.props;
    if (initialTimeout) {
      clearTimeout(initialTimeout);
    }

    dispatchPollingAction(statisticsManagementReduxModule.actions.pollingActions.reset());
  };

  queueStats = () => {
    const { statisticsManagementSelectedData, queueStats } = this.props;
    const keys = Object.keys(statisticsManagementSelectedData);
    if (keys.length > 0) {
      const tables = keys.map((key) => {
        const table = statisticsManagementSelectedData[key];
        return {
          database: table.database,
          schema: table.schema,
          table: table.table
        };
      });

      queueStats(tables);
    }
  };

  selectAll = () => {
    const { statisticsManagementData, selectAllData } = this.props;
    selectAllData(statisticsManagementData);
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
      schemas,
      isStatisticsChartFetching,
      statisticsChartDataLoaded,
      statisticsChartData,
      fetchStatisticsChartData,
      isRunningStats,
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
            {config.app.title} - DWH Statistics Management{' '}
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
          />
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={statisticsManagementSelectedCount < 1 || isRunningStats}
            loading={isRunningStats}
            onClick={this.queueStats}
          >
            Queue stats
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
    statisticsManagementData: statisticsManagementReduxModule.selectors.getStatisticsManagement(state),
    statisticsManagementFetchingError: statisticsManagementReduxModule.selectors.getFetchingError(state),
    statisticsManagementFilters: statisticsChartReduxModule.selectors.getFilters(state),
    statisticsManagementSelectedData: statisticsManagementReduxModule.selectors.getSelected(state),
    statisticsManagementSelectedCount: statisticsManagementReduxModule.selectors.getSelectedCount(state),
    schemas: statisticsSchemasReduxModule.selectors.getSchemas(state),
    isStatisticsChartFetching: state.statisticsChart.isFetching,
    statisticsChartDataLoaded: state.statisticsChart.dataLoaded,
    statisticsChartData: statisticsChartReduxModule.selectors.getStatisticsChartData(state),
    isRunningStats: state.statisticsManagement.isRunningStats
  }),
  dispatch => ({
    dispatchPollingAction: dispatch,
    fetchAllData: (schema, date, months) =>
      Promise.all([
        dispatch(statisticsManagementReduxModule.actions.fetch()),
        dispatch(statisticsChartReduxModule.actions.fetch(schema, date, months))
      ]),
    fetchStatisticsManagementData: () =>
      dispatch(statisticsManagementReduxModule.actions.fetch()),
    fetchStatisticsChartData: (schema, date, months) =>
      dispatch(statisticsChartReduxModule.actions.fetch(schema, date, months)),
    resetAllData: () => {
      dispatch(statisticsManagementReduxModule.actions.reset());
      dispatch(statisticsChartReduxModule.actions.reset());
    },
    selectData: (id, data) => dispatch(statisticsManagementReduxModule.actions.select(id, data)),
    unselectData: id => dispatch(statisticsManagementReduxModule.actions.unselect(id)),
    selectAllData: data => dispatch(statisticsManagementReduxModule.actions.selectAll('schema_table', data)),
    unselectAllData: () => dispatch(statisticsManagementReduxModule.actions.unselectAll()),
    queueStats: tables => dispatch(statisticsManagementReduxModule.actions.queueStats(tables))
  })
)(Management));
