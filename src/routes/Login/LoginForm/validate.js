import memoize from 'lru-memoize';
import { createValidator, required, email } from 'javascript-utils/lib/validation';

const validator = createValidator({
  email: [required(), email()],
  password: required()
});

export default memoize(10)(validator);
