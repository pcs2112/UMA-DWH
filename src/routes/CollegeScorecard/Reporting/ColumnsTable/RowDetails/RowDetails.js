import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'javascript-utils/lib/utils';
import {
  DetailsDiv, DetailsColDiv, DetailsRow
} from '../../css';

const RowDetails = ({ row }) => {
  const tableWidth = document.getElementById('columns-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth - 20;
  let desc = row.original.entry_description;
  if (isEmpty(desc)) {
    desc = 'Not available.';
  }

  return (
    <DetailsDiv
      style={{
        width
      }}
    >
      <DetailsColDiv>
        <DetailsRow>
          {desc}
        </DetailsRow>
      </DetailsColDiv>
    </DetailsDiv>
  );
};

RowDetails.propTypes = {
  row: PropTypes.object.isRequired
};

export default RowDetails;
