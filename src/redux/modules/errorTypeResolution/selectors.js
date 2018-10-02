import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector,
  createGetItemByIdSelector,
  createGetPropertySelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('errorTypeResolution', 'dataLoaded', 'data');

/**
 * Returns the updating file id.
 */
const _getUpdatingFileId = createGetPropertySelector('errorTypeResolution', 'updating');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('errorTypeResolution', 'fetchingError', 'payload');

/**
 * Returns the Error type resolution data.
 */
export const getFiles = createGetItemsSelector(_getData);

/**
 * Returns the current updating file.
 */
export const getUpdatingFile = createGetItemByIdSelector(_getData, _getUpdatingFileId);

/**
 * Gets the initial form values for the updating file.
 */
export const getUpdatingFileInitialValues = createSelector(
  [getUpdatingFile],
  (file) => {
    if (!file) {
      return {};
    }

    return {
      id: file.id,
      description: file.description,
      file_path_filename: file.file_path_filename
    };
  }
);
