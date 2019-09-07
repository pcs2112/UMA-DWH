import {
  createDataSelector,
  createFetchingErrorSelector, createGetItemByIdSelector,
  createGetItemsSelector, createGetPropertySelector
} from 'javascript-utils/lib/selectors';
import { createSelector } from 'reselect/lib/index';

const _getData = createDataSelector('telecomSkills', 'dataLoaded', 'data');

/**
 * Returns the updating skill id.
 */
const _getUpdatingSkillId = createGetPropertySelector('telecomSkills', 'updating');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('telecomSkills', 'fetchingError', 'payload');

/**
 * Returns the skills data.
 */
export const getData = createGetItemsSelector(_getData);

/**
 * Returns the current updating skill.
 */
export const getUpdatingSkill = createGetItemByIdSelector(_getData, _getUpdatingSkillId);

/**
 * Gets the initial form values for the updating skill.
 */
export const getUpdatingSkillInitialValues = createSelector(
  [getUpdatingSkill],
  (skill) => {
    if (!skill) {
      return {};
    }

    return {
      skill_id: skill.id,
      skill_name: skill.rep_skill_display_name,
      skill_update_type: skill.rep_skill_update_type
    };
  }
);

/**
 * Returns the updating types dropdown options.
 */
export const getUpdatingTypesDropdownOptions = () => ([
  {
    key: 'SNAPSHOT',
    value: 'SNAPSHOT',
    text: 'SNAPSHOT'
  },
  {
    key: 'CHANGE',
    value: 'CHANGE',
    text: 'CHANGE'
  }
]);
