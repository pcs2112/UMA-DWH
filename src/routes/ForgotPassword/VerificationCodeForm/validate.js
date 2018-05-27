import memoize from 'lru-memoize';
import { createValidator, required, numericLength } from 'javascript-utils/lib/validation';

const validation = createValidator({
  verification_code: [required(), numericLength(6, 'Please enter a valid code.')]
});

export default memoize(10)(validation);
