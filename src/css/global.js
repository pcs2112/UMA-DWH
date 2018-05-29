import { getWindowWidth, getWindowHeight } from 'javascript-utils/lib/device';

const windowWith = getWindowWidth();
const windowHeight = getWindowHeight();
const mainMenuWidth = 250;

let mainContainerWidth = windowWith - mainMenuWidth;
if (mainContainerWidth < 1150) {
  mainContainerWidth = 1150;
}

const lighterSteelBlue = '#ECF1F3';
const lightSteelBlue = '#84b4D3';
const mediumTurquoise = '#60AACD';
const darkTurquoise = '#0494CB';
const darkCyan = '#046CA4';
const success = '#21BA45';
const error = '#ff0000';
const warning = '#e8bf03';
const rowHighLight = '#DFE9F3';

export default {
  colors: {
    lighterSteelBlue,
    lightSteelBlue,
    mediumTurquoise,
    darkTurquoise,
    darkCyan,
    success,
    error,
    warning,
    rowHighLight
  },
  pageHeaderSegment: {
    background: lighterSteelBlue
  },
  pageHeaderSegmentH1: {
    textAlign: 'center'
  },
  mainMenuWith: `${mainMenuWidth}px`,
  mainContainerWidth: `${mainContainerWidth}px`,
  mainTableHeight: `${windowHeight - 220}px`
};
