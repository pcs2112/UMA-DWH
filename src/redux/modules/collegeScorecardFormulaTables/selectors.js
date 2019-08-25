import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardFormulaTables', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector(
  'collegeScorecardFormulaTables', 'fetchingError', 'payload'
);

/**
 * Returns the college scorecard tables with formulas data from the state.
 */
export const getCollegeScorecardFormulaTables = createSelector(
  [_getData],
  data => data
);

/**
 * Returns the college scorecard tables with formulas dropdown options.
 */
export const getCollegeScorecardFormulaTablesDropdownOptions = createSelector(
  [_getData],
  data => data.map(item => ({
    key: item.schema_table,
    value: item.schema_table,
    text: item.schema_table
  }))
);
