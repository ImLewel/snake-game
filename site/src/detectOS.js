'use strict';

const osColl = [
  'Android',
  'iPhone',
  'iPad',
  'iPod',
  'BlackBerry',
  'Opera Mini',
];

const mobCanvasSize = [224, 192];
const maxMobRes = { width: 500, height: 900 };
let arrowsShown = false;

const getCanvasDimensions = () => {
  [roomData.width, roomData.height] = mobCanvasSize;
};

const checkOS = () => osColl.some((item) => UA.match(item));

if (checkOS()) {
  getCanvasDimensions();
  arrowsShown = true;
  roomData.settingsOpened = false;
  settingsMenu.style.display = displayStyles.none;
  roomData.fps = 10;
}

roomData.frameTime = roomData.secInMilSec / roomData.fps;
canvas.width = roomData.width;
canvas.height = roomData.height;
canvas.style.width = `${roomData.width}px`;
canvas.style.height = `${roomData.height}px`;
