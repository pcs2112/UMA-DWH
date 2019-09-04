import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { FILTERS_STATE_KEY_NAME } from './constants';

const _getData = createDataSelector('collegeScorecardCategories', 'dataLoaded', 'data');

const _getFilters = createGetPropertySelector('collegeScorecardCategories', FILTERS_STATE_KEY_NAME);

/**
 * Returns the updating category id.
 */
const _getUpdatingCategoryId = createGetPropertySelector('collegeScorecardCategories', 'updating');


/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecardCategories', 'fetchingError', 'payload');

/**
 * Returns the college scorecard categories data from the state.
 */
export const getCollegeScorecardCategories = createSelector(
  [_getData],
  data => data
);

/**
 * Selector to get the filters.
 */
export const getFilters = createSelector(
  [_getFilters],
  (filtersFromState) => {
    const { query } = filtersFromState;
    return {
      query
    };
  }
);

/**
 * Returns the current updating category.
 */
export const getUpdatingCategory = createGetItemByIdSelector(_getData, _getUpdatingCategoryId);

/**
 * Gets the initial form values for the updating user.
 */
export const getUpdatingCategoryInitialValues = createSelector(
  [getUpdatingCategory],
  (category) => {
    if (!category) {
      return {};
    }

    return {
      category_id: category.id,
      category_name: category.category_name,
      csv_file: category.csv_file,
      description: category.description,
      where_unit_id_table: category.where_unit_id_table,
      formula: category.formula
    };
  }
);
