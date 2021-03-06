import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { getDisplayName } from 'javascript-utils/lib/react';
import { FILTERS_EXEC_DELAY } from '../../constants';


export const withInputFilter = (WrappedComponent) => {
  class WithInputFilter extends Component {
    static propTypes = {
      onChange: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
    }

    handleOnChange = (e, { value }) => {
      const { onChange } = this.props;
      onChange(value);
    };

    render() {
      return (
        <WrappedComponent {...this.props} onChange={this.handleOnChange} />
      );
    }
  }

  WithInputFilter.displayName = `WithInputFilter(${getDisplayName(WrappedComponent)})`;

  return WithInputFilter;
};
