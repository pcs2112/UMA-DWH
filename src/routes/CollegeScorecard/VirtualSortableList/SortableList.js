import React, { Component } from 'react';
import { List } from 'react-virtualized';
import PropTypes from 'prop-types';
import { sortableElement, sortableHandle } from 'react-sortable-hoc';
import styles from '../../../css/react-virtualized.less';

const DragHandle = sortableHandle(() => <div className={styles.SortableHandle} />);

const SortableItem = sortableElement(({ value, style }) => (
  <div className={styles.SortableItem} style={style}>
    <DragHandle />
    {value}
  </div>
));

class SortableList extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    overscanRowCount: PropTypes.number.isRequired,
    getRef: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    itemValueKeyName: PropTypes.string.isRequired
  };

  renderRow = ({ index, style }) => {
    const { items, itemValueKeyName } = this.props;
    return (
      <SortableItem
        key={index}
        index={index}
        value={items[index][itemValueKeyName]}
        style={style}
      />
    );
  };

  render() {
    const {
      width, height, rowHeight, overscanRowCount, items, getRef
    } = this.props;

    return (
      <List
        className={styles.SortableList}
        ref={getRef}
        rowHeight={rowHeight}
        rowRenderer={this.renderRow}
        rowCount={items.length}
        width={width}
        height={height}
        overscanRowCount={overscanRowCount}
      />
    );
  }
}

export default SortableList;
