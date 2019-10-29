import moment from 'moment';
import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';

const _getData = createDataSelector('dataCubes', 'dataLoaded', 'data');

/**
 * Returns the updating cube id.
 */
const _getUpdatingCubeId = createGetPropertySelector('dataCubes', 'updating');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('dataCubes', 'fetchingError', 'payload');

/**
 * Returns the cubes data.
 */
export const getData = createGetItemsSelector(_getData);

/**
 * Returns the current updating cube.
 */
export const getUpdatingCube = createGetItemByIdSelector(_getData, _getUpdatingCubeId);

/**
 * Gets the initial form values for the cube form.
 */
export const getCubeFormInitialValues = createSelector(
  [getUpdatingCube],
  (cube) => {
    const now = moment();
    if (!cube) {
      return {
        active_flag: false,
        materialize: false,
        cube_date_start: now.format('YYYY-MM-DD'),
        cube_date_end: now.add(1, 'days').format('YYYY-MM-DD'),
        schedule: {
          active_flag: false,
          frequency: 'daily',
          daily_frequency: 1,
          daily_start: '05:00',
          duration_start: now.format('YYYY-MM-DD'),
          duration_end: now.add(1, 'days').format('YYYY-MM-DD')
        }
      };
    }

    return {
      cube_id: cube.id,
      ...cube
    };
  }
);

export const _getCubeDefinition = createGetPropertySelector('dataCubesDims', 'selected');
