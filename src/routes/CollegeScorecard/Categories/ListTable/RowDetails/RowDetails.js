import React from 'react';
import PropTypes from 'prop-types';

const RowDetails = ({ row }) => {
  console.log(row);
  const tableWidth = document.getElementById('cs-categories-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth;
  return (
    <div
      style={{
        width
      }}
    >
      Details here
    </div>
  );
};

RowDetails.propTypes = {
  row: PropTypes.object.isRequired
};

export default RowDetails;
