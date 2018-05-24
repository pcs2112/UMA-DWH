import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import config from 'config';
import globalCss from 'css/global';
import etlProcedureHistory from 'redux/modules/etlProcedureHistory';
import etlServers from 'redux/modules/etlServers';
import ProcedureHistoryTable from './ProcedureHistoryTable';
import Filters from './Filters';

class ProceduresHistory extends Component {
  static propTypes = {
    isProcedureHistoryFetching: PropTypes.bool.isRequired,
    procedureHistoryDataLoaded: PropTypes.bool.isRequired,
    procedureHistoryData: PropTypes.array.isRequired,
    procedureHistoryFetchingError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    fetchProcedureHistory: PropTypes.func.isRequired,
    resetProcedureHistory: PropTypes.func.isRequired,
    servers: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { fetchProcedureHistory } = this.props;
    const { serverName, dbName, procedureName } = this.props.filters;
    fetchProcedureHistory(serverName, dbName, procedureName);
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
      fetchProcedureHistory,
      servers,
      filters
    } = this.props;
    return (
      <div>
        <Segment style={globalCss.pageHeaderSegment}>
          <h1 style={globalCss.pageHeaderSegmentH1}>
            {config.app.title} - ETL Procedures History
          </h1>
        </Segment>
        <Segment>
          <Filters
            servers={servers}
            onChange={fetchProcedureHistory}
            {...filters}
          />
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

export default connect(
  state => ({
    isProcedureHistoryFetching: state.etlProcedureHistory.isFetching,
    procedureHistoryDataLoaded: state.etlProcedureHistory.dataLoaded,
    procedureHistoryData: etlProcedureHistory.selectors.procedureHistory(state),
    procedureHistoryFetchingError: etlProcedureHistory.selectors.procedureHistoryError(state),
    servers: etlServers.selectors.servers(state),
    filters: etlProcedureHistory.selectors.filters(state)
  }),
  dispatch => ({
    fetchProcedureHistory: (serverName, dbName, procedureName) =>
      dispatch(etlProcedureHistory.actions.fetchHistory(serverName, dbName, procedureName)),
    resetProcedureHistory: () => {
      dispatch(etlProcedureHistory.actions.reset());
    }
  })
)(ProceduresHistory);
