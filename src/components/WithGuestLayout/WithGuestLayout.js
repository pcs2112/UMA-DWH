import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { getDisplayName } from 'javascript-utils/lib/react';
import { Grid } from 'semantic-ui-react';
import { mainColStyles, mainGridStyles } from './css';

export const withGuestLayout = (WrappedComponent) => {
  const WithGuestLayout = (
    {
      isLoggedIn, ...rest
    },
    {
      router: { history: { location } }
    }
  ) => (
    <Route
      {...rest}
      render={({ staticContext }) => {
        if (isLoggedIn) {
          if (staticContext) {
            staticContext.status = 302;
          }

          const { from } = location.state || { from: { pathname: '/' } };

          return <Redirect to={from} />;
        }

        return (
          <Grid textAlign="center" verticalAlign="middle" style={mainGridStyles}>
            <Grid.Column style={mainColStyles}>
              <WrappedComponent {...rest} />
            </Grid.Column>
          </Grid>
        );
      }}
    />
  );

  WithGuestLayout.propTypes = {
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };

  WithGuestLayout.contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        location: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  };

  WithGuestLayout.displayName = `WithGuestLayout(${getDisplayName(WrappedComponent)})`;

  return connect(
    state => ({
      isLoggedIn: state.user.isLoggedIn
    }),
    null
  )(WithGuestLayout);
};
