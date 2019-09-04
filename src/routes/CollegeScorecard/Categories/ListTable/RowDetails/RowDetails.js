import React from 'react';
import PropTypes from 'prop-types';
import {
  DetailsDiv, DetailsColDiv, DetailsLabel, DetailsRow
} from '../../css';

const RowDetails = ({ row }) => {
  const tableWidth = document.getElementById('cs-categories-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth;
  return (
    <DetailsDiv
      style={{
        width
      }}
    >
      <DetailsColDiv>
        <DetailsRow><DetailsLabel>Category Name: </DetailsLabel>{row.original.category_name}</DetailsRow>
        <DetailsRow><DetailsLabel>Category Description: </DetailsLabel>{row.original.description}</DetailsRow>
        <DetailsRow><DetailsLabel>CSV File: </DetailsLabel>{row.original.csv_file}</DetailsRow>
        <DetailsRow><DetailsLabel>Formula: </DetailsLabel>{row.original.formula}</DetailsRow>
      </DetailsColDiv>
    </DetailsDiv>
  );
};

RowDetails.propTypes = {
  row: PropTypes.object.isRequired
};

export default RowDetails;
