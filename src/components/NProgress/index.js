import React from 'react';
import { renderToString } from 'react-dom/server';
import nprogress from 'nprogress';
import globalCss from 'css/global';
import NProgressTemplate from './NProgressTemplate';

let enabled = true;

const initialize = (config = {}) => {
  enabled = false;
  const template = renderToString(<NProgressTemplate color={globalCss.colors.success} />);
  nprogress.configure(Object.assign({}, { template }, config));
};

const enable = () => {
  enabled = true;
};

const start = () => {
  if (enabled) {
    nprogress.start();
  }
};

const inc = () => {
  if (enabled) {
    nprogress.inc();
  }
};

const done = () => {
  if (enabled) {
    nprogress.done();
  }
};

export default {
  initialize,
  enable,
  start,
  inc,
  done
};
