import moment from 'moment';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { isEmpty } from 'javascript-utils/lib/utils';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetPropertySelector,
  createGetItemByIdSelector
} from 'javascript-utils/lib/selectors';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATETIME_LOCAL_FORMAT } from '../../../../constants';

const _getData = createDataSelector('etlManualRuns', 'dataLoaded', 'data');

const _getUpdatingManualRunId = createGetPropertySelector('etlManualRuns', 'updating');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlManualRuns', 'fetchingError', 'payload');

/**
 * Returns the manual runs data.
 */
export const getData = createSelector(
  [_getData],
  (data) => data
);

/**
 * Selector to get the filters.
 */
export const getFilters = createGetPropertySelector('etlManualRuns', 'filters');

/**
 * Selector to get the domains.
 */
export const getDomains = createGetPropertySelector('etlManualRuns', 'domains');

/**
 * Returns the current updating manual run.
 */
export const getUpdatingManualRun = createGetItemByIdSelector(_getData, _getUpdatingManualRunId);

/**
 * Gets the initial form values for the manual run form.
 */
export const getManualRunFormInitialValues = createSelector(
  [getUpdatingManualRun],
  (manualRun) => {
    if (!manualRun) {
      return {
        status: 'SCHEDULE'
      };
    }

    const status = isEmpty(manualRun.status) ? 'SCHEDULE' : manualRun.status.toUpperCase();
    return {
      ...manualRun,
      status: status === 'CANCELED' ? 'CANCEL' : status,
      run_request: (manualRun.run_request || '').toUpperCase(),
      from_dttm: manualRun.from_dttm
        ? moment(manualRun.from_dttm, DEFAULT_DATETIME_FORMAT).format(DEFAULT_DATETIME_LOCAL_FORMAT) : '',
      to_dttm: manualRun.to_dttm
        ? moment(manualRun.to_dttm, DEFAULT_DATETIME_FORMAT).format(DEFAULT_DATETIME_LOCAL_FORMAT) : ''
    };
  }
);
