import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { getDisplayName } from 'javascript-utils/lib/react';
import { Grid } from 'semantic-ui-react';
import userModule from 'redux/modules/user';
import MainMenu from 'components/MainMenu';
import { mainContentCss } from './css';

export const withMainLayout = (WrappedComponent) => {
  const WithMainLayout = ({
    location, isLoggedIn, onLogout, ...rest
  }) => (
    <Route
      {...rest}
      render={({ staticContext }) => {
        if (!isLoggedIn) {
          if (staticContext) {
            staticContext.status = 302;
          }

          return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
        }

        return (
          <div>
            <MainMenu onLogout={onLogout} />
            <div style={mainContentCss}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <WrappedComponent location={location} {...rest} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        );
      }}
    />
  );

  WithMainLayout.propTypes = {
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
  };

  WithMainLayout.displayName = `WithMainLayout(${getDisplayName(WrappedComponent)})`;

  return connect(
    state => ({
      isLoggedIn: state.user.isLoggedIn
    }),
    dispatch => ({
      onLogout: () => dispatch(userModule.actions.logout())
    })
  )(WithMainLayout);
};
