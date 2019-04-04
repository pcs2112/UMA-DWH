import React from 'react';
import ContentEditable from '../../../components/ContentEditable';

export default [
  {
    width: 25,
    label: ''
  },
  {
    dataKey: 'column_name',
    width: 260,
    label: 'COLUMN_NAME',
    render: (key, value, rowData, classNames, style) => (
      <ContentEditable
        key={key}
        html={value}
        classNames={classNames}
        styles={style}
        onChange={() => {}}
      />
    )
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
    label: 'LONG DESCRIPTION'
  }
];
