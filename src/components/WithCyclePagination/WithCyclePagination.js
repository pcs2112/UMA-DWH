import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'javascript-utils/lib/react';

export const withCyclePagination = (WrappedComponent) => {
  class WithCyclePagination extends Component {
    static propTypes = {
      fetchPrev: PropTypes.func.isRequired,
      fetchNext: PropTypes.func.isRequired,
      prevDisabled: PropTypes.bool.isRequired
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      );
    }
  }

  WithCyclePagination.displayName = `WithCyclePagination(${getDisplayName(WrappedComponent)})`;

  return WithCyclePagination;
};
