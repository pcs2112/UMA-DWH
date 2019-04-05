import React from 'react';
import TableCellEditable from '../../../components/TableCellEditable';

export default [
  {
    width: 25,
    label: ''
  },
  {
    dataKey: 'column_name',
    width: 260,
    label: 'COLUMN_NAME'
  },
  {
    dataKey: 'row_count',
    width: 100,
    label: 'POPULATED',
    isNumeric: true
  },
  {
    dataKey: 'per_pop',
    width: 100,
    label: '% POPULATED',
    isNumeric: true
  },
  {
    dataKey: 'entry_data_type',
    width: 120,
    label: 'DATA_TYPE'
  },
  {
    dataKey: 'entry_name',
    width: 600,
    label: 'DESCRIPTION'
  },
  {
    dataKey: 'entry_description',
    width: 1400,
    label: 'REPORT COLUMN NAME',
    render: (key, value, rowData, onCellChange) => (
      <TableCellEditable
        key={key}
        html={value}
        onChange={newValue => onCellChange(parseInt(key.split('-')[0], 10), rowData.column_name, newValue)}
      />
    )
  }
];
