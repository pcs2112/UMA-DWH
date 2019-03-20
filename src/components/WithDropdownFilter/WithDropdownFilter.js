import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { getDisplayName } from 'javascript-utils/lib/react';
import { FILTERS_EXEC_DELAY } from '../../constants';


export const withDropdownFilter = (WrappedComponent) => {
  class WithDropdownFilter extends Component {
    static propTypes = {
      defaultValue: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
      onChange: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.handleOnChange = debounce(this.handleOnChange, FILTERS_EXEC_DELAY);
    }

    handleOnChange = (e, { value }) => {
      const { defaultValue, onChange } = this.props;
      if (value !== defaultValue) {
        onChange(value);
      }
    };

    render() {
      return (
        <WrappedComponent {...this.props} onChange={this.handleOnChange} />
      );
    }
  }

  WithDropdownFilter.displayName = `WithDropdownFilter(${getDisplayName(WrappedComponent)})`;

  return WithDropdownFilter;
};
