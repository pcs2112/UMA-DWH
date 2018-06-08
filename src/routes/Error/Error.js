import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import withGuestLayout from 'components/WithGuestLayout';
import withMainLayout from 'components/WithMainLayout';

const ErrorMessage = ({ header, content }) => ( // eslint-disable-line
  <Message
    error
    header={header}
    content={content}
    icon="remove"
    size="huge"
  />
);

const GuestErrorRoute = withGuestLayout(ErrorMessage);
const MainErrorRoute = withMainLayout(ErrorMessage);

const Error = ({ isLoggedIn, ...rest }) => {
  if (!isLoggedIn) {
    return (<GuestErrorRoute {...rest} />);
  }

  return (<MainErrorRoute {...rest} />);
};

Error.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  header: PropTypes.string,
  content: PropTypes.string
};

Error.defaultProps = {
  header: '404 Error',
  content: 'Page not found.'
};

export default connect(
  state => ({
    isLoggedIn: state.user.isLoggedIn
  }),
  null
)(Error);
