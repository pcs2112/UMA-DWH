import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

export const runCheckButtonCss = {
  marginTop: '1rem'
};

export const DetailsDiv = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '1rem 3rem 1rem 3rem'
});

export const DetailsColDiv = glamorous.div({
  flexGrow: 1,
  width: '33.3%'
});

export const DetailsLabel = glamorous.span({
  fontWeight: 'bold'
});

export const DetailsRow = glamorous.p({
  marginBottom: '.25rem'
});

const RowDetails = ({ row }) => {
  const tableWidth = document.getElementById('list-tbl').offsetWidth;
  const width = tableWidth < 1000 ? 1000 : tableWidth;
  const obj = {
    id: row.original.id,
  };
  Object.keys(row.original).sort().forEach((key) => {
    if (key !== 'id') {
      obj[key] = row.original[key];
    }
  });
  const keys = Object.keys(obj);

  return (
    <DetailsDiv
      style={{
        width,
      }}
    >
      <DetailsColDiv>
        {keys.slice(0, 10)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{obj[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(10, 20)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{obj[key]}</DetailsRow>)
        }
      </DetailsColDiv>
      <DetailsColDiv>
        {keys.slice(20, 30)
          .map(key =>
            <DetailsRow key={key}><DetailsLabel>{key.toUpperCase()}: </DetailsLabel>{obj[key]}</DetailsRow>)
        }
      </DetailsColDiv>
    </DetailsDiv>
  );
};

RowDetails.propTypes = {
  row: PropTypes.object.isRequired,
};

export default RowDetails;
