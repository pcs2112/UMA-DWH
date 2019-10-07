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
    if (!cube) {
      return {};
    }

    return {
      cube_id: cube.id,
      ...cube
    };
  }
);
