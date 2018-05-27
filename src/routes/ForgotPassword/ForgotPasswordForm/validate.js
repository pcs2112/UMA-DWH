import memoize from 'lru-memoize';
import { createValidator, required, email } from 'javascript-utils/lib/validation';

const validation = createValidator({
  email: [required(), email()]
});

export default memoize(10)(validation);
