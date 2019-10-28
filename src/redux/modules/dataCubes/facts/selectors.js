import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import {
  SELECTED_STATE_KEY_NAME,
} from './constants';

const _getData = createDataSelector('dataCubesFacts', 'dataLoaded', 'data');

const _getSelectedFactDimIdx = createGetPropertySelector('dataCubesDims', SELECTED_STATE_KEY_NAME);

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('dataCubesFacts', 'fetchingError', 'payload');

/**
 * Returns the facts data.
 */
export const getData = createSelector(
  [_getData, _getSelectedFactDimIdx],
  (data, factDimIdx) => data.map((fact) => ({
    ...fact,
    label: fact.fact_table + (factDimIdx[fact.fact_table]
      ? ` (${Object.keys(factDimIdx[fact.fact_table]).length})` : '')
  }))
);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('dataCubesFacts', SELECTED_STATE_KEY_NAME);
