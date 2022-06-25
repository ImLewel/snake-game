'use strict';

const displayStyles = {
  shown: '',
  none: 'none',
};


const osColl = {
  android: 'Android',
  iPhone: 'iPhone',
  iPad: 'iPad',
  iPod: 'iPod',
  blackBerry: 'BlackBerry',
  operaMini: 'Opera Mini',
};

const mobCanvasSize = [224, 192];
const maxMobRes = { width: 500, height: 900 };
let arrowsShown = false;

const getCanvasDimensions = () => {
  [roomData.width, roomData.height] = mobCanvasSize;
};

for (const os of Object.keys(osColl)) {
  if (UA.match(osColl[os]) && window.innerWidth <= maxMobRes.width) {
    getCanvasDimensions();
    arrowsShown = true;
    roomData.settingsOpened = false;
    settingsMenu.style.display = displayStyles.none;
    roomData.fps = 11;
  }
}
