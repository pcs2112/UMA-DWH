import glamorous from 'glamorous';

export const DetailsDiv = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '1rem 3rem 1rem 3rem'
});

export const DetailsColDiv = glamorous.div({
  flexGrow: 1,
  width: '100%'
});

export const DetailsLabel = glamorous.span({
  fontWeight: 'bold'
});

export const DetailsRow = glamorous.p({
  marginBottom: '.25rem'
});
