import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import config from 'config';
import statisticsHistoryReduxModule from 'redux/modules/statisticsHistory';
import statisticsManagementReduxModule from 'redux/modules/statisticsManagement';
import statisticsChartReduxModule from 'redux/modules/statisticsChart';
import statisticsSchemasReduxModule from 'redux/modules/statisticsSchemas';
import withMainLayout from 'components/WithMainLayout';
import globalCss from 'css/global';
import ManagementTable from './ManagementTable';
import DateChartFilter from '../DateChartFilter';
import DropdownFilters from '../DropdownFilters';

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
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    selectData: PropTypes.func.isRequired,
    unselectData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData, statisticsManagementFilters } = this.props;
    const { schema, date, months } = statisticsManagementFilters;
    fetchAllData(schema, date, months);
  }

  componentWillUnmount() {
    const { resetAllData } = this.props;
    resetAllData();
  }

  resetChart = () => {
    const { fetchAllData, statisticsManagementFilters } = this.props;
    const { schema, months } = statisticsManagementFilters;
    fetchAllData(schema, moment().format(DEFAULT_DATE_FORMAT), months);
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
      fetchAllData,
      selectData,
      unselectData
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
                onClick={fetchAllData}
                {...statisticsManagementFilters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                schemas={schemas}
                onChange={fetchAllData}
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
            disabled={statisticsManagementSelectedCount < 1}
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
    isStatisticsManagementFetching: state.statisticsManagement.isFetching,
    statisticsManagementDataLoaded: state.statisticsManagement.dataLoaded,
    statisticsManagementData: statisticsManagementReduxModule.selectors.getStatisticsManagement(state),
    statisticsManagementFetchingError: statisticsManagementReduxModule.selectors.getFetchingError(state),
    statisticsManagementFilters: statisticsHistoryReduxModule.selectors.getFilters(state),
    statisticsManagementSelectedData: statisticsManagementReduxModule.selectors.getSelected(state),
    statisticsManagementSelectedCount: statisticsManagementReduxModule.selectors.getSelectedCount(state),
    schemas: statisticsSchemasReduxModule.selectors.getSchemas(state),
    isStatisticsChartFetching: state.statisticsChart.isFetching,
    statisticsChartDataLoaded: state.statisticsChart.dataLoaded,
    statisticsChartData: statisticsChartReduxModule.selectors.getStatisticsChartData(state)
  }),
  dispatch => ({
    fetchAllData: (schema, date, months) =>
      Promise.all([
        dispatch(statisticsManagementReduxModule.actions.fetch()),
        dispatch(statisticsChartReduxModule.actions.fetch(schema, date, months))
      ]),
    resetAllData: () => {
      dispatch(statisticsManagementReduxModule.actions.reset());
      dispatch(statisticsManagementReduxModule.actions.reset());
    },
    selectData: (id, data) => dispatch(statisticsManagementReduxModule.actions.select(id, data)),
    unselectData: id => dispatch(statisticsManagementReduxModule.actions.unselect(id))
  })
)(Management));
