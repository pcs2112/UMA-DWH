import memoize from 'lru-memoize';
import { createValidator, required, match } from 'javascript-utils/lib/validation';

const validation = createValidator({
  new_password: required(),
  confirm_new_password: [required(), match('new_password', "Your passwords don't match.")]
});

export default memoize(10)(validation);
