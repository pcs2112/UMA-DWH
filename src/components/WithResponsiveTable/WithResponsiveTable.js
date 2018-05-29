import React, { Component, Fragment } from 'react';
import debounce from 'lodash/debounce';
import { Responsive } from 'semantic-ui-react';
import { getDisplayName } from 'javascript-utils/lib/react';
import { getWindowHeight } from 'javascript-utils/lib/device';

export const withResponsiveTable = (WrappedComponent, minTableHeight = 320, offsetHeight = 440) => {
  class WithResponsiveTable extends Component {
    constructor(props) {
      super(props);

      this.state = {
        tableHeight: this.getTableHeight()
      };

      this.handleResize = debounce(this.handleResize, 500);
    }

    getTableHeight = () => {
      const windowHeight = getWindowHeight();
      const newHeight = windowHeight - offsetHeight;
      return newHeight < minTableHeight ? minTableHeight : newHeight;
    };

    handleResize = () => {
      const newHeight = this.getTableHeight();
      if (newHeight !== this.state.tableHeight) {
        this.setState({
          tableHeight: newHeight
        });
      }
    };

    render() {
      return (
        <Responsive as={Fragment} onUpdate={this.handleResize}>
          <WrappedComponent tableHeight={this.state.tableHeight} {...this.props} />
        </Responsive>
      );
    }
  }

  WithResponsiveTable.displayName = `WithResponsiveTable(${getDisplayName(WrappedComponent)})`;

  return WithResponsiveTable;
};
