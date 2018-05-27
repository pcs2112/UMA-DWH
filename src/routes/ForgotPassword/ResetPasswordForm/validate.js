import memoize from 'lru-memoize';
import { createValidator, required, match } from 'javascript-utils/lib/validation';

const validation = createValidator({
  newPassword: required(),
  confirmNewPassword: [required(), match('newPassword', "Your passwords don't match.")]
});

export default memoize(10)(validation);
