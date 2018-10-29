import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import config from 'config';
import statisticsHistoryReduxModule from 'redux/modules/statisticsHistory';
import statisticsChartReduxModule from 'redux/modules/statisticsChart';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import HistoryTable from './HistoryTable';
import DateChartFilter from '../DateChartFilter';
import DropdownFilters from '../DropdownFilters';

class History extends Component {
  static propTypes = {
    isStatisticsHistoryFetching: PropTypes.bool.isRequired,
    statisticsHistoryDataLoaded: PropTypes.bool.isRequired,
    statisticsHistoryData: PropTypes.array.isRequired,
    statisticsHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    statisticsHistoryFilters: PropTypes.object.isRequired,
    schemas: PropTypes.array.isRequired,
    isStatisticsChartFetching: PropTypes.bool.isRequired,
    statisticsChartDataLoaded: PropTypes.bool.isRequired,
    statisticsChartData: PropTypes.array.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, statisticsHistoryFilters } = this.props;
    const { schema, date, months } = statisticsHistoryFilters;
    fetchAllData(schema, date, months);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  resetChart = () => {
    const { fetchAllData, statisticsHistoryFilters } = this.props;
    const { schema, months } = statisticsHistoryFilters;
    fetchAllData(schema, moment().format(DEFAULT_DATE_FORMAT), months);
  };

  render() {
    const {
      isStatisticsHistoryFetching,
      statisticsHistoryDataLoaded,
      statisticsHistoryData,
      statisticsHistoryFetchingError,
      statisticsHistoryFilters,
      schemas,
      isStatisticsChartFetching,
      statisticsChartDataLoaded,
      statisticsChartData,
      fetchAllData
    } = this.props;

    const current = moment(statisticsHistoryFilters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - Statistics History{' '}
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
                {...statisticsHistoryFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                schemas={schemas}
                onChange={fetchAllData}
                {...statisticsHistoryFilters}
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
            dataLoaded={statisticsHistoryDataLoaded}
            data={statisticsHistoryData}
            isFetching={isStatisticsHistoryFetching}
            fetchingError={statisticsHistoryFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isStatisticsHistoryFetching: state.statisticsHistory.isFetching,
    statisticsHistoryDataLoaded: state.statisticsHistory.dataLoaded,
    statisticsHistoryData: statisticsHistoryReduxModule.selectors.getStatisticsHistory(state),
    statisticsHistoryFetchingError: statisticsHistoryReduxModule.selectors.getFetchingError(state),
    statisticsHistoryFilters: statisticsHistoryReduxModule.selectors.getFilters(state),
    schemas: statisticsSchemasReduxModule.selectors.getSchemas(state),
    isStatisticsChartFetching: state.statisticsChart.isFetching,
    statisticsChartDataLoaded: state.statisticsChart.dataLoaded,
    statisticsChartData: statisticsChartReduxModule.selectors.getStatisticsChartData(state)
  }),
  dispatch => ({
    fetchAllData: (schema, date, months) =>
      Promise.all([
        dispatch(statisticsHistoryReduxModule.actions.fetch(schema, date, months)),
        dispatch(statisticsChartReduxModule.actions.fetch(schema, date, months))
      ]),
    resetAllData: () => {
      dispatch(statisticsHistoryReduxModule.actions.reset());
      dispatch(statisticsChartReduxModule.actions.reset());
    }
  })
)(History));
