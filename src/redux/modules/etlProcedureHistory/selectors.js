import { createSelector } from 'reselect';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'helpers/selectors';
import etlCycleHistory from 'redux/modules/etlCycleHistory';
import etlServers from 'redux/modules/etlServers';

const emptyFilters = {
  serverName: '',
  dbName: '',
  procedureName: ''
};

/**
 * Returns the procedure history data from the state.
 * @param {Object} state
 */
const _getData = createDataSelector('etlProcedureHistory');

/**
 * Returns the filters from the state.
 * @param {Object} state
 */
const _getFilters = state => (objectHasOwnProperty(state.etlProcedureHistory, 'serverName') ? {
  serverName: state.etlProcedureHistory.serverName,
  dbName: state.etlProcedureHistory.dbName,
  procedureName: state.etlProcedureHistory.procedureName
} : emptyFilters);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlProcedureHistory');

/**
 * Returns the ETL procedure history data from the state.
 */
export const getProcedureHistory = createGetItemsSelector(_getData);

/**
 * Returns the default filters for the procedure history page.
 */
export const getFilters = createSelector(
  [etlServers.selectors.getServers, etlCycleHistory.selectors.getLastProcedureSelected, _getFilters],
  (servers, lastProcedureSelected, filtersFromState) => {
    if (servers.length < 1) {
      return {
        serverName: '',
        dbName: '',
        procedureName: ''
      };
    }

    if (lastProcedureSelected && !isEmpty(lastProcedureSelected.source_server_name)) {
      return {
        serverName: lastProcedureSelected.source_server_name,
        dbName: lastProcedureSelected.source_db_name,
        procedureName: lastProcedureSelected.calling_proc
      };
    }

    let { serverName, dbName, procedureName } = filtersFromState;

    // Set the default serverName
    if (serverName === '') {
      serverName = servers[0].name;
      dbName = '';
    }

    // Set the default dbName
    if (dbName === '') {
      dbName = servers.find(server => server.name.toUpperCase() === serverName.toUpperCase()).dbs[0].name;
      procedureName = '';
    }

    // Set the default procedureName
    if (procedureName === '') {
      procedureName = servers.find(server => server.name.toUpperCase() === serverName.toUpperCase())
        .dbs.find(db => db.name.toUpperCase() === dbName.toUpperCase())
        .procedures[0].etl_stored_procedure;
    }

    return {
      serverName,
      dbName,
      procedureName
    };
  }
);
