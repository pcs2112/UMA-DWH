import React, { Component } from 'react';
import clsx from 'clsx';
import { getDisplayName } from 'javascript-utils/lib/react';
import styles from './styles.less';

export const withVirtualizedTable = (WrappedComponent, columns) => {
  class WithVirtualizedTable extends Component {
    constructor(props) {
      super(props);
    }

    _renderHeaderCell = ({ columnIndex, key, style }) => {
      if (columnIndex < 1) {
        return null;
      }

      return (
        <div className={styles.HeaderCell} key={key} style={style}>
          {columns[columnIndex].label}
        </div>
      );
    };

    _renderBodyCell = ({
      columnIndex, key, rowIndex, style
    }) => {
      if (columnIndex < 1) {
        return null;
      }

      const rowClass = this._getRowColorClass(rowIndex);
      const classNames = clsx(rowClass, styles.Cell);
      const rowData = this._rowGetter(rowIndex);
      const value = rowData[columns[columnIndex].dataKey];

      return (
        <div className={classNames} key={key} style={style}>
          {value}
        </div>
      );
    };

    render() {
      return (
        <WrappedComponent tableHeight={this.state.tableHeight} {...this.props} />
      );
    }
  }

  WithVirtualizedTable.displayName = `WithVirtualizedTable(${getDisplayName(WrappedComponent)})`;

  return withVirtualizedTable ;
};
