import React, { Component, Fragment } from 'react';
import debounce from 'lodash/debounce';
import { Responsive } from 'semantic-ui-react';
import { getDisplayName } from 'javascript-utils/lib/react';
import { getWindowHeight } from 'javascript-utils/lib/device';

export const withResponsiveContainer = (WrappedComponent, minContainerHeight = 320, offsetHeight = 440) => {
  class WithResponsiveContainer extends Component {
    constructor(props) {
      super(props);

      this.state = {
        containerHeight: this.getContainerHeight()
      };

      this.handleResize = debounce(this.handleResize, 500);
    }

    getContainerHeight = () => {
      const windowHeight = getWindowHeight();
      const newHeight = windowHeight - offsetHeight;
      return newHeight < minContainerHeight ? minContainerHeight : newHeight;
    };

    handleResize = () => {
      const newHeight = this.getContainerHeight();
      if (newHeight !== this.state.containerHeight) {
        this.setState({
          containerHeight: newHeight
        });
      }
    };

    render() {
      return (
        <Responsive as={Fragment} onUpdate={this.handleResize}>
          <WrappedComponent containerHeight={this.state.containerHeight} {...this.props} />
        </Responsive>
      );
    }
  }

  WithResponsiveContainer.displayName = `WithResponsiveContainer(${getDisplayName(WrappedComponent)})`;

  return WithResponsiveContainer;
};
