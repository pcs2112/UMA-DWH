import memoize from 'lru-memoize';
import {
  createValidator, required
} from 'javascript-utils/lib/validation';

export const existingSkillValidator = memoize(10)(createValidator({
  skill_id: required(),
  skill_update_type: required()
}));
