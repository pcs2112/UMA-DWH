import moment from 'moment';
import _ from 'lodash';
import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';
import { getDimIdx, getAllData } from '../dims/selectors';

const now = moment();
const defaultValues = {
  cube_name: '',
  active_flag: false,
  materialize: false,
  view_name: '',
  table_name: '',
  cube_date_start: now.format('YYYY-MM-DD'),
  cube_date_end: now.add(1, 'days').format('YYYY-MM-DD'),
  schedule: {
    name: '',
    active_flag: false,
    frequency: 'daily',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    daily_frequency: 1,
    daily_occurs_interval: 0,
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
  [getUpdatingCube, getAllData, getDimIdx],
  (cube, dims, dimIdx) => {
    if (!cube) {
      return defaultValues;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cube.xml_document, 'text/xml');
    const factElements = xmlDoc.getElementsByTagName('fact');
    const definition = [];
    factElements.forEach((factEl) => {
      const fact = factEl.getAttribute('table').toUpperCase();
      const dimsElements = factEl.getElementsByTagName('dimension');
      dimsElements.forEach((dimEl) => {
        definition.push(dims[dimIdx[`${fact}.${dimEl.textContent.toUpperCase()}`]]);
      });
    });

    const schedule = _.get(cube, 'schedule', { ...defaultValues.schedule });
    const newSchedule = {
      ...schedule,
      daily_frequency: schedule.daily_frequency ? 1 : 0,
      active_flag: schedule.active_flag === 1
    };

    return {
      ...cube,
      cube_id: cube.id,
      active_flag: cube.active_flag === 1,
      materialize: cube.materialize === 1,
      cube_date_start: cube.cube_date_start.substring(0, 10),
      cube_date_end: cube.cube_date_end.substring(0, 10),
      definition,
      schedule: {
        ...newSchedule
      }
    };
  }
);
