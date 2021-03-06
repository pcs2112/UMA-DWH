import globalCss from 'css/global';

export const menuCss = {
  position: 'fixed',
  top: '0px',
  bottom: '0px',
  left: '0px',
  width: globalCss.mainMenuWith,
  paddingBottom: '1em',
  background: `${globalCss.colors.darkTurquoise}`,
  overflowY: 'auto',
  borderRight: `1px solid ${globalCss.colors.darkCyan}`
};

export const chuckImgCss = {
  width: '50px',
  position: 'fixed',
  bottom: '10px',
  left: '10px'
};
