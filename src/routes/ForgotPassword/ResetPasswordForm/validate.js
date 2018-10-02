import memoize from 'lru-memoize';
import {
  createValidator, required, match, validPassword
} from 'javascript-utils/lib/validation';

const validation = createValidator({
  new_password: [required(), validPassword(1, 1, 8)],
  confirm_new_password: [required(), match('new_password', "Your passwords don't match.")]
});

export default memoize(10)(validation);
