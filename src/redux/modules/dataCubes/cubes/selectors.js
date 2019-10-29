import moment from 'moment';
import _ from 'lodash';
import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';
import { getDimColumnNameIdx, getAllData } from '../dims/selectors';

const now = moment();
const defaultValues = {
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
  [getUpdatingCube, getAllData, getDimColumnNameIdx],
  (cube, dims, dimColumnNameIdx) => {
    if (!cube) {
      return defaultValues;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cube.xml_document, 'text/xml');
    const factElements = xmlDoc.getElementsByTagName('fact');
    const definition = [];
    factElements.forEach((factEl) => {
      const dimsElements = factEl.getElementsByTagName('dimension');
      dimsElements.forEach((dimEl) => {
        definition.push(dims[dimColumnNameIdx[dimEl.textContent]]);
      });
    });

    const schedule = _.get(cube, 'schedule', { ...defaultValues.schedule });

    return {
      ...cube,
      cube_id: cube.id,
      active_flag: cube.active_flag === 1,
      materialize: cube.materialize === 1,
      cube_date_start: cube.cube_date_start.substring(0, 10),
      cube_date_end: cube.cube_date_end.substring(0, 10),
      definition,
      schedule: {
        ...schedule,
        daily_frequency: schedule.daily_frequency ? 1 : 0,
        active_flag: schedule.active_flag === 1
      }
    };
  }
);
