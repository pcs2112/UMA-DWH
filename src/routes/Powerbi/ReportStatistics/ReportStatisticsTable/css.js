import glamorous from 'glamorous';

export const DetailsDiv = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap'
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
