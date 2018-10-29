import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import config from 'config';
import statisticsReduxModule from 'redux/modules/statistics';
import statisticsChartReduxModule from 'redux/modules/statisticsChart';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import HistoryTable from './HistoryTable';
import DateChartFilter from './DateChartFilter';
import DropdownFilters from './DropdownFilters';

class StatisticsHistory extends Component {
  static propTypes = {
    isStatisticsFetching: PropTypes.bool.isRequired,
    statisticsDataLoaded: PropTypes.bool.isRequired,
    statisticsData: PropTypes.array.isRequired,
    statisticsFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    statisticsFilters: PropTypes.object.isRequired,
    statisticsSelectedData: PropTypes.object.isRequired,
    statisticsSelectedCount: PropTypes.number.isRequired,
    schemas: PropTypes.array.isRequired,
    isStatisticsChartFetching: PropTypes.bool.isRequired,
    statisticsChartDataLoaded: PropTypes.bool.isRequired,
    statisticsChartData: PropTypes.array.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, statisticsFilters } = this.props;
    const { schema, date, months } = statisticsFilters;
    fetchAllData(schema, date, months);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  resetChart = () => {
    const { fetchAllData } = this.props;
    const { schema, months } = this.props.statisticsFilters;
    fetchAllData(schema, moment().format(DEFAULT_DATE_FORMAT), months);
  };

  render() {
    const {
      isStatisticsFetching,
      statisticsDataLoaded,
      statisticsData,
      statisticsFetchingError,
      statisticsFilters,
      statisticsSelectedData,
      statisticsSelectedCount,
      schemas,
      isStatisticsChartFetching,
      statisticsChartDataLoaded,
      statisticsChartData,
      fetchAllData,
      selectData,
      unselectData
    } = this.props;

    const current = moment(statisticsFilters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - DWH Statistics{' '}
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
                onClick={fetchAllData}
                {...statisticsFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                schemas={schemas}
                onChange={fetchAllData}
                {...statisticsFilters}
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
            dataLoaded={statisticsDataLoaded}
            data={statisticsData}
            isFetching={isStatisticsFetching}
            fetchingError={statisticsFetchingError}
            selectedData={statisticsSelectedData}
            selectData={selectData}
            unselectData={unselectData}
          />
        </Segment>
        <Segment>
          <Button
            size="small"
            disabled={statisticsSelectedCount < 1}
          >
            Run stats on tables
          </Button>
          <Button
            size="small"
            disabled={false}
          >
            Run stats on schemas
          </Button>
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isStatisticsFetching: state.statistics.isFetching,
    statisticsDataLoaded: state.statistics.dataLoaded,
    statisticsData: statisticsReduxModule.selectors.getStatistics(state),
    statisticsFetchingError: statisticsReduxModule.selectors.getFetchingError(state),
    statisticsFilters: statisticsReduxModule.selectors.getFilters(state),
    statisticsSelectedData: statisticsReduxModule.selectors.getSelected(state),
    statisticsSelectedCount: statisticsReduxModule.selectors.getSelectedCount(state),
    schemas: statisticsSchemasReduxModule.selectors.getSchemas(state),
    isStatisticsChartFetching: state.statisticsChart.isFetching,
    statisticsChartDataLoaded: state.statisticsChart.dataLoaded,
    statisticsChartData: statisticsChartReduxModule.selectors.getStatisticsChartData(state)
  }),
  dispatch => ({
    fetchAllData: (schema, date, months) =>
      Promise.all([
        dispatch(statisticsReduxModule.actions.fetch(schema, date, months)),
        dispatch(statisticsChartReduxModule.actions.fetch(schema, date, months))
      ]),
    resetAllData: () => {
      dispatch(statisticsReduxModule.actions.reset());
      dispatch(statisticsChartReduxModule.actions.reset());
    },
    selectData: (id, data) => dispatch(statisticsReduxModule.actions.select(id, data)),
    unselectData: id => dispatch(statisticsReduxModule.actions.unselect(id))
  })
)(StatisticsHistory));
