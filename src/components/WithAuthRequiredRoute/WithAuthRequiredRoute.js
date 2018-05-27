import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { getDisplayName } from 'javascript-utils/lib/react';

const withAuthRequiredRoute = (WrappedComponent) => {
  const WithAuthRequiredRoute = ({ loggedIn, ...rest }) => (
    <Route
      {...rest}
      render={({ staticContext }) => {
        if (loggedIn) {
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
    loggedIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object
  };

  WithAuthRequiredRoute.displayName = `WithAuthRequiredRoute(${getDisplayName(WrappedComponent)})`;

  return connect(
    state => ({
      isLoggedIn: state.user.isLoggedIn
    }),
    null
  )(WithAuthRequiredRoute);
};

export default withAuthRequiredRoute;
