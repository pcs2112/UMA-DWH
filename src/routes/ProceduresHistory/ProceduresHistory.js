import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Grid } from 'semantic-ui-react';
import moment from 'moment';
import config from 'config';
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
    resetProcedureHistory: PropTypes.func.isRequired,
    servers: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    isProcedureRuntimeChartFetching: PropTypes.bool.isRequired,
    procedureRuntimeChartDataLoaded: PropTypes.bool.isRequired,
    procedureRuntimeChartData: PropTypes.array.isRequired,
    fetchAllData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchAllData } = this.props;
    const {
      serverName, dbName, procedureName, date
    } = this.props.filters;
    fetchAllData(serverName, dbName, procedureName, date);
  }

  componentWillUnmount() {
    this.props.resetProcedureHistory();
  }

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
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - ETL Procedures History{' '}
            ({moment(filters.date, DEFAULT_DATE_FORMAT).format('MMM D, YYYY')})
          </h1>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={10}>
              <DateChartFilter
                isFetching={isProcedureRuntimeChartFetching}
                dataLoaded={procedureRuntimeChartDataLoaded}
                data={procedureRuntimeChartData}
                onClick={fetchAllData}
                {...filters}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <DropdownFilters
                servers={servers}
                onChange={fetchAllData}
                {...filters}
              />
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
    fetchAllData: (serverName, dbName, procedureName, date) =>
      Promise.all([
        dispatch(etlProcedureHistory.actions.fetchHistory(serverName, dbName, procedureName, date)),
        dispatch(procedureRuntimeChart.actions.fetch(procedureName, date))
      ]),
    resetProcedureHistory: () => {
      dispatch(etlProcedureHistory.actions.reset());
    }
  })
)(ProceduresHistory));
