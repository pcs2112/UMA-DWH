import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import userModule from 'redux/modules/user';

export default () => next => (action) => {
  const { error } = action;
  if (typeof error === 'object' && objectHasOwnProperty(error, 'error_type')) {
    const errorType = error.error_type;
    const statusCode = error.status_code;
    if (statusCode === 401 && (errorType === 'JWT_ERROR' || errorType === 'UNAUTHORIZED_REQUEST')) {
      next(userModule.actions.logout());
    }
  }

  return next(action);
};
