import { createSelector } from 'reselect';

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = state => state.etlRunCheck.selected;

/**
 * Selector to get the selected items count.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);
