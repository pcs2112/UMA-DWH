import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { getDisplayName } from 'javascript-utils/lib/react';

export const withAuthRequiredRoute = (WrappedComponent) => {
  const WithAuthRequiredRoute = ({ isLoggedIn, ...rest }) => (
    <Route
      {...rest}
      render={({ staticContext }) => {
        if (isLoggedIn) {
          return <WrappedComponent {...rest} />;
        }

        if (staticContext) {
          staticContext.status = 302;
        }

        return <Redirect to="/login" />;
      }}
    />
  );

  WithAuthRequiredRoute.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
  };

  WithAuthRequiredRoute.displayName = `WithAuthRequiredRoute(${getDisplayName(WrappedComponent)})`;

  return connect(
    state => ({
      isLoggedIn: state.user.isLoggedIn
    }),
    null
  )(WithAuthRequiredRoute);
};
