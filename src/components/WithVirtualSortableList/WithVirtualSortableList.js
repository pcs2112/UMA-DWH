import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'javascript-utils/lib/react';
import { sortableContainer } from 'react-sortable-hoc';
import { OVERSCAN_ROW_COUNT, ROW_HEIGHT } from '../../constants/reactVirtualized';
import styles from '../../css/react-virtualized.less';

export const withVirtualSortableList = (WrappedComponent) => {
  const SortableVirtualList = sortableContainer(WrappedComponent);

  class WithVirtualSortableList extends Component {
    static propTypes = {
      containerHeight: PropTypes.number.isRequired,
      containerWidth: PropTypes.number.isRequired,
      items: PropTypes.array.isRequired,
      itemValueKeyName: PropTypes.string.isRequired,
      helperClass: PropTypes.string,
      onSortEnd: PropTypes.func.isRequired
    };

    static defaultProps = {
      helperClass: styles.SortableHelper
    };

    registerListRef = (listInstance) => {
      this.List = listInstance;
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        return;
      }

      const { onSortEnd } = this.props;
      onSortEnd(oldIndex, newIndex);

      this.List.recomputeRowHeights();
      this.List.forceUpdate();
    };

    render() {
      const { containerHeight, containerWidth, helperClass } = this.props;
      return (
        <SortableVirtualList
          useDragHandle
          helperClass={helperClass}
          getRef={this.registerListRef}
          {...this.props}
          onSortEnd={this.onSortEnd}
          width={containerWidth}
          height={containerHeight}
          rowHeight={ROW_HEIGHT}
          overscanRowCount={OVERSCAN_ROW_COUNT}
        />
      );
    }
  }

  WithVirtualSortableList.displayName = `WithVirtualSortableList(${getDisplayName(WrappedComponent)})`;

  return WithVirtualSortableList;
};
