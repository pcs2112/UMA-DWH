import { createSelector } from 'reselect';
import moment from 'moment';
import { objectHasOwnProperty, isEmpty } from 'javascript-utils/lib/utils';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
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
  procedureName: '',
  date: moment().format(DEFAULT_DATE_FORMAT)
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
  procedureName: state.etlProcedureHistory.procedureName,
  date: state.etlProcedureHistory.date
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
        procedureName: '',
        date: moment().format(DEFAULT_DATE_FORMAT)
      };
    }

    let { date } = filtersFromState;

    if (lastProcedureSelected && !isEmpty(lastProcedureSelected.source_server_name)) {
      return {
        serverName: lastProcedureSelected.source_server_name.toUpperCase(),
        dbName: lastProcedureSelected.source_db_name.toUpperCase(),
        procedureName: lastProcedureSelected.calling_proc.toUpperCase(),
        date: date === '' ? moment().format(DEFAULT_DATE_FORMAT) : date
      };
    }

    let {
      serverName, dbName, procedureName
    } = filtersFromState;

    // Set the default serverName
    if (serverName === '') {
      serverName = servers[0].name;
      dbName = '';
    }

    const normalizedServerName = serverName.toUpperCase();

    // Set the default dbName
    if (dbName === '') {
      dbName = servers.find(server => server.name.toUpperCase() === normalizedServerName).dbs[0].name;
      procedureName = '';
    }

    const normalizedDbName = dbName.toUpperCase();

    // Set the default procedureName
    if (procedureName === '') {
      procedureName = servers.find(server => server.name.toUpperCase() === normalizedServerName)
        .dbs.find(db => db.name.toUpperCase() === normalizedDbName)
        .procedures[0].etl_stored_procedure;
    }

    const normalizedProcedureName = procedureName.toUpperCase();

    // Set the default date
    if (date === '') {
      date = moment().format(DEFAULT_DATE_FORMAT);
    }

    return {
      serverName: normalizedServerName,
      dbName: normalizedDbName,
      procedureName: normalizedProcedureName,
      date
    };
  }
);
