import glamorous from 'glamorous';

export const NavDiv = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap'
});

export const NavColDiv = glamorous.div({
  flexGrow: 1,
  width: '30%'
});

export const NavLeftColDiv = glamorous(NavColDiv)({
  textAlign: 'right'
});

export const NavCenterColDiv = glamorous(NavColDiv)({
  width: '40%',
  textAlign: 'center',
  fontWeight: 'bold'
});

export const NavRightColDiv = glamorous(NavColDiv)({
  textAlign: 'left'
});
