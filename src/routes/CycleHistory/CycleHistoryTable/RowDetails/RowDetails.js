import React from 'react';
import PropTypes from 'prop-types';
import { DetailsDiv, DetailsColDiv, DetailsLabel, DetailsRow } from '../../css';

const RowDetails = ({ row }) => {
  const keys = Object.keys(row.original);
  const tableWidth = document.getElementById('cycle-history-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth;
  return (
    <DetailsDiv
      style={{
        width
      }}
    >
      <DetailsColDiv>
        <DetailsRow key="id"><DetailsLabel>ID: </DetailsLabel>{row.original.id}</DetailsRow>
        {keys.slice(1, 10)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(11, 21)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(21, 31)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{row.original[key]}</DetailsRow>)
        }
      </DetailsColDiv>
    </DetailsDiv>
  );
};

RowDetails.propTypes = {
  row: PropTypes.object.isRequired
};

export default RowDetails;
