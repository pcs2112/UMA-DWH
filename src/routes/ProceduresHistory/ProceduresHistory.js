import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Grid, Button } from 'semantic-ui-react';
import moment from 'moment';
import globalCss from 'css/global';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import etlProcedureHistory from 'redux/modules/etlProcedureHistory';
import etlServers from 'redux/modules/etlServers';
import procedureRuntimeChart from 'redux/modules/procedureRuntimeChart';
import withMainLayout from 'components/WithMainLayout';
import ProcedureHistoryTable from './ProcedureHistoryTable';
import DropdownFilters from './DropdownFilters';
import DateChartFilter from './DateChartFilter';

class ProceduresHistory extends Component {
  static propTypes = {
    isProcedureHistoryFetching: PropTypes.bool.isRequired,
    procedureHistoryDataLoaded: PropTypes.bool.isRequired,
    procedureHistoryData: PropTypes.array.isRequired,
    procedureHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    servers: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    isProcedureRuntimeChartFetching: PropTypes.bool.isRequired,
    procedureRuntimeChartDataLoaded: PropTypes.bool.isRequired,
    procedureRuntimeChartData: PropTypes.array.isRequired,
    fetchAllData: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData } = this.props;
    const {
      serverName, dbName, procedureName, date, months
    } = this.props.filters;
    fetchAllData(serverName, dbName, procedureName, date, months);
  }

  componentWillUnmount() {
    this.props.resetAllData();
  }

  resetChart = () => {
    const { fetchAllData } = this.props;
    const {
      serverName, dbName, procedureName, months
    } = this.props.filters;
    fetchAllData(serverName, dbName, procedureName, moment().format(DEFAULT_DATE_FORMAT), months);
  };

  render() {
    const {
      isProcedureHistoryFetching,
      procedureHistoryDataLoaded,
      procedureHistoryData,
      procedureHistoryFetchingError,
      servers,
      filters,
      isProcedureRuntimeChartFetching,
      procedureRuntimeChartDataLoaded,
      procedureRuntimeChartData,
      fetchAllData
    } = this.props;

    const current = moment(filters.date, DEFAULT_DATE_FORMAT);
    const today = moment();

    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {__APP_TITLE__} - ETL Procedures History{' '}
            ({current.format('MMM D, YYYY')})
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={11}>
              <DateChartFilter
                isFetching={isProcedureRuntimeChartFetching}
                dataLoaded={procedureRuntimeChartDataLoaded}
                data={procedureRuntimeChartData}
                onClick={fetchAllData}
                {...filters}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DropdownFilters
                servers={servers}
                onChange={fetchAllData}
                {...filters}
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
          <ProcedureHistoryTable
            dataLoaded={procedureHistoryDataLoaded}
            data={procedureHistoryData}
            isFetching={isProcedureHistoryFetching}
            fetchingError={procedureHistoryFetchingError}
          />
        </Segment>
      </div>
    );
  }
}

export default withMainLayout(connect(
  state => ({
    isProcedureHistoryFetching: state.etlProcedureHistory.isFetching,
    procedureHistoryDataLoaded: state.etlProcedureHistory.dataLoaded,
    procedureHistoryData: etlProcedureHistory.selectors.getProcedureHistory(state),
    procedureHistoryFetchingError: etlProcedureHistory.selectors.getFetchingError(state),
    servers: etlServers.selectors.getServers(state),
    filters: etlProcedureHistory.selectors.getFilters(state),
    isProcedureRuntimeChartFetching: state.procedureRuntimeChart.isFetching,
    procedureRuntimeChartDataLoaded: state.procedureRuntimeChart.dataLoaded,
    procedureRuntimeChartData: procedureRuntimeChart.selectors.getProcedureRuntimeChartData(state)
  }),
  dispatch => ({
    fetchAllData: (serverName, dbName, procedureName, date, months) =>
      Promise.all([
        dispatch(etlProcedureHistory.actions.fetchHistory(serverName, dbName, procedureName, date, months)),
        dispatch(procedureRuntimeChart.actions.fetch(procedureName, date, months))
      ]),
    resetAllData: () => {
      dispatch(etlProcedureHistory.actions.reset());
      dispatch(procedureRuntimeChart.actions.reset());
    }
  })
)(ProceduresHistory));
