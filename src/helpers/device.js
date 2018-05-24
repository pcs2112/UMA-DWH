/**
 * Returns the window's width.
 *
 * @returns {Number}
 */
export const getWindowWidth = () => {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  return w.innerWidth || e.clientWidth || g.clientWidth;
};

/**
 * Returns the window's height.
 *
 * @returns {Number}
 */
export const getWindowHeight = () => {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  return w.innerHeight || e.clientHeight || g.clientHeight;
};

/**
 * Returns the browser's document hidden property name.
 *
 * @returns {String}
 */
export const documentHiddenPropertyName = () => {
  let hidden = null;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
  }

  return hidden;
};
