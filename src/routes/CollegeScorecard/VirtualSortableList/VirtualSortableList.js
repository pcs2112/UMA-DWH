import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortableContainer } from 'react-sortable-hoc';
import { ROW_HEIGHT, OVERSCAN_ROW_COUNT } from '../../../constants/reactVirtualized';
import SortableList from './SortableList';
import withResponsiveContainer from '../../../components/WithResponsiveContainer';
import styles from '../../../css/react-virtualized.less';

const SortableVirtualList = sortableContainer(SortableList);

class VirtualSortableList extends Component {
  static propTypes = {
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    itemValueKeyName: PropTypes.string.isRequired,
    onSortEnd: PropTypes.func.isRequired
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
    const { containerHeight, containerWidth } = this.props;
    return (
      <SortableVirtualList
        useDragHandle
        helperClass={styles.SortableHelper}
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

export default withResponsiveContainer(VirtualSortableList, 320, 280);
