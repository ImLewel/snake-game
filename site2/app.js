'use strict';

const canvas = document.getElementById('game-canvas');
const widthSelector = document.querySelectorAll('.fieldSizeBtn');
const headColor = document.querySelector('#headColor');
const bodyColor = document.querySelector('#bodyColor');
const berryColor = document.querySelector('#berryColor');
const faceExample = document.querySelector('#faceExample');
const tileExample = document.querySelector('#tileExample');
const score = document.getElementById('score');
const record = document.getElementById('record');
const wins = document.getElementById('wins');
const timer = document.getElementById('timer');
const context = canvas.getContext('2d');
const faceSlider = document.getElementById('faceSlider');
const tileSlider = document.getElementById('tileSlider');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('dataField');
const mobController = document.getElementById('mobController');
const UA = navigator.userAgent;

class SoundPlayer extends SoundController {
  setVolume() {
    this.slider.oninput = () => {
      this.file.volume = this.slider.value / this.divider;
      if (this.file.volume === 0) super.mute();
      else super.unMute();
    };
  }
  tryPlay() {
    this.file.play();
  }
}

const sounds = {
  none: '',
  berry: './sound/berry.mp3',
  win: './sound/win.mp3',
  gameover: './sound/gameover.mp3',
};


const soundPlayer = new SoundPlayer('#soundSlider', '#soundPic', sounds.none);
soundPlayer.setVolume();

const displayStyles = {
  shown: '',
  none: 'none',
};

mobController.style.display = displayStyles.none;

const roomData = {
  fps: 17,
  secInMilSec: 1000,
  initialTime: 'Time: 00:00',
  currTime: null,
  width: 512,
  height: 384,
  scoreCount: 0,
  recordCount: 0,
  winsCount: 0,
  avaliableBonus: { small: 1, big: 2 },
  currBonus: 0,
  settingsOpened: true,
};

const frameTime = roomData.secInMilSec / roomData.fps;

const time = {
  msec: 0,
  sec: 0,
  min: 0,
};

const maxTime = {
  msec: 1000,
  sec: 60,
  min: 60,
};

const snake = {
  sizeCell: 16,
  x: 160,
  y: 160,
  dirX: 0,
  dirY: 0,
  stepSize: 16,
  tails: [],
  maxTails: 20,
  head: null,
  face: null,
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

canvas.width = roomData.width;
canvas.height = roomData.height;
canvas.style.width = `${roomData.width}px`;
canvas.style.height = `${roomData.height}px`;

const widthBtnIds = {
  normal: 'normal',
  wide: 'wide',
};

timer.innerHTML = roomData.initialTime;

const setSound = (path) => {
  soundPlayer.file.src = path;
  soundPlayer.tryPlay();
};

const addStr = (mainStr, secondStr) => (secondStr + mainStr);

const timeFormatter = (secs, mins) => {
  const arr = [secs, mins];
  for (const [index, elem] of arr.entries()) {
    if (elem < 10) arr[index] = addStr(elem, '0');
  }
  roomData.currTime = arr.join(':');
  timer.innerHTML = `Time: ${roomData.currTime}`;
};

const countTime = (coll, maxTime, frameTime) => {
  coll.msec += frameTime;
  if (coll.msec >= maxTime.msec) {
    coll.msec -= maxTime.msec;
    coll.sec++;
  }
  if (coll.sec === maxTime.sec) {
    coll.sec -= maxTime.sec;
    coll.min++;
  }
  timeFormatter(coll.sec, coll.min);
};

const berry = {
  x: 0,
  y: 0,
  avaliableSize: { small: 8, big: 16 },
  sizeBerry: 8,
};

const align = () => (snake.sizeCell - berry.sizeBerry) / 2;
let indent;

const randInt = (min, max) => Math.round(Math.random() * (max - min) + min);

const randPos = (dimension) => {
  indent = align();
  const tileNum = randInt(0, (dimension - snake.sizeCell) / snake.sizeCell);
  const tilePos = tileNum * snake.sizeCell;
  const truePos = tilePos + indent;
  return truePos;
};

let isPaused = false;
const playIcons = {
  play: './icons/continue.png',
  pause: './icons/pause.png',
};
pauseBtn.onclick = () => {
  if (!isPaused) {
    isPaused = true;
    pauseBtn.src = playIcons.play;
  } else {
    isPaused = false;
    pauseBtn.src = playIcons.pause;
  }
};

const smallBerryChance = 0.75;
const berryPos = () => {
  const currChance = Math.random();
  if (currChance <= smallBerryChance) {
    berry.sizeBerry = berry.avaliableSize.small;
  } else berry.sizeBerry = berry.avaliableSize.big;
  berry.x = randPos(canvas.width);
  berry.y = randPos(canvas.height);
};
berryPos();

const tileColl = {
  face: { slider: faceSlider, ex: faceExample, name: 'faces' },
  tile: { slider: tileSlider, ex: tileExample, name: 'tiles' },
};
const getCustoms = (coll) => {
  for (const obj of Object.keys(coll)) {
    coll[obj].slider.oninput = () => {
      const dir = coll[obj].name;
      const subDir = coll[obj].name.slice(0, 4);
      coll[obj].ex.src = `./${dir}/${subDir + coll[obj].slider.value}.png`;
    };
  }
};
getCustoms(tileColl);

const colorColl = {
  head: { slider: headColor, color: null },
  body: { slider: bodyColor, color: null },
  berry: { slider: berryColor, color: null },
};

const getColor = () => {
  for (const obj of Object.keys(colorColl)) {
    colorColl[obj].slider.oninput = () => {
      colorColl[obj].color = colorColl[obj].slider.value;
    };
  }
};
getColor();

const mapTiler = () => {
  const pattern = context.createPattern(tileColl.tile.ex, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const setSnakeColor = (cell) => {
  if (cell === snake.head) {
    context.fillStyle = colorColl.head.color || headColor.value;
  } else {
    context.fillStyle = colorColl.body.color || bodyColor.value;
  }
  context.fillRect(cell.x, cell.y, snake.sizeCell, snake.sizeCell);
};

let keybrdPressFlag = false;
const lastInput = {
  key: null,
  arrow: null,
};

const keysColl = {
  w: { key: 'KeyW', oppKey: 'KeyS', dirX: 0, dirY: -snake.stepSize },
  s: { key: 'KeyS', oppKey: 'KeyW', dirX: 0, dirY: snake.stepSize },
  a: { key: 'KeyA', oppKey: 'KeyD', dirX: -snake.stepSize, dirY: 0 },
  d: { key: 'KeyD', oppKey: 'KeyA', dirX: snake.stepSize, dirY: 0 },
};

const mobileArrows = {
  up: { id: 'up', oppId: 'down', dirX: 0, dirY: -snake.stepSize },
  down: { id: 'down', oppId: 'up', dirX: 0, dirY: snake.stepSize },
  left: { id: 'left', oppId: 'right', dirX: -snake.stepSize, dirY: 0 },
  right: { id: 'right', oppId: 'left', dirX: snake.stepSize, dirY: 0 },
};

const control = (coll) => {
  onkeydown = (e) => {
    for (const letter of Object.keys(coll)) {
      if (e.code === coll[letter].key) {
        if (coll[letter].oppKey !== lastInput.key) {
          snake.dirX = coll[letter].dirX;
          snake.dirY = coll[letter].dirY;
          lastInput.key = e.code;
          keybrdPressFlag = true;
        }
      }
    }
  };
};
control(keysColl);

const mobileInput = (coll) => {
  onclick = (event) => {
    for (const key of Object.keys(coll)) {
      if (coll[key].id === event.target.id) {
        if (coll[key].oppId !== lastInput.arrow) {
          snake.dirX = coll[key].dirX;
          snake.dirY = coll[key].dirY;
          lastInput.arrow = coll[key].id;
          keybrdPressFlag = true;
        }
      }
    }
  };
};

if (arrowsShown === true) {
  mobController.style.display = displayStyles.shown;
  mobileInput(mobileArrows);
}

const setFieldSize = (normalMult, multX, multY) => {
  if (!keybrdPressFlag) {
    for (const btn of widthSelector) {
      let currMultX = multX;
      let currMultY = multY;
      btn.onclick = () => {
        if (btn.id === widthBtnIds.normal) {
          currMultX = normalMult;
          currMultY = normalMult;
        }
        canvas.width = roomData.width * currMultX;
        canvas.height = roomData.height * currMultY;
        canvas.style.width = `${roomData.width * currMultX}px`;
        canvas.style.height = `${roomData.height * currMultY}px`;
      };
    }
  }
};
setFieldSize(1, 1.5, 1.25);

const resetProp = (value, obj, properties) => {
  if (typeof properties !== 'undefined') {
    if (Array.isArray(properties)) {
      for (const property of properties) {
        obj[property] = value;
      }
    } else obj[properties] = value;
  }
};

const refreshGame = () => {
  resetProp(0, snake, ['dirX', 'dirY']);
  resetProp(160, snake, ['x', 'y']);
  resetProp(20, snake, 'maxTails');
  resetProp([], snake, 'tails');
  resetProp(0, roomData, ['scoreCount', 'currTime']);
  resetProp(0, time, ['sec', 'min']);
  resetProp(roomData.initialTime, timer, 'innerHTML');
  resetProp(null, lastInput, ['key', 'arrow']);
  keybrdPressFlag = false;
  setSound(sounds.gameover);
  berryPos();
};

restartBtn.onclick = () => refreshGame();

settingsBtn.onclick = () => {
  if (roomData.settingsOpened === false) {
    settingsMenu.style.display = displayStyles.shown;
    roomData.settingsOpened = true;
  } else {
    settingsMenu.style.display = displayStyles.none;
    roomData.settingsOpened = false;
  }
};

const collisionBorder = () => {
  if (snake.x < 0) snake.x = canvas.width - snake.sizeCell;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - snake.sizeCell;
  else if (snake.y >= canvas.height) snake.y = 0;
};

const checkSelfCollision = (head, cell) => {
  const selfCollided = head !== cell && head.x === cell.x && head.y === cell.y;
  if (selfCollided) refreshGame();
};

const checkBerryCollision = (cell) => {
  if (cell.x + indent === berry.x && cell.y + indent === berry.y) {
    if (berry.sizeBerry === berry.avaliableSize.small) {
      roomData.currBonus = roomData.avaliableBonus.small;
    } else {
      roomData.currBonus = roomData.avaliableBonus.big;
    }
    if (roomData.scoreCount >= roomData.recordCount) {
      roomData.recordCount += roomData.currBonus;
    }
    setSound(sounds.berry);
    roomData.scoreCount += roomData.currBonus;
    snake.maxTails += roomData.currBonus;
    berryPos();
  }
};

const drawSnake = () => {
  snake.x += snake.dirX;
  snake.y += snake.dirY;
  collisionBorder();
  if (parseInt(faceSlider.value) !== 0) snake.face = faceExample;
  else snake.face = null;
  snake.tails.unshift({ x: snake.x, y: snake.y });
  snake.head = snake.tails[0];
  if (snake.tails.length > snake.maxTails) snake.tails.pop();
  for (const cell of snake.tails) {
    setSnakeColor(cell);
    if (snake.face !== null) {
      context.drawImage(snake.face, snake.head.x, snake.head.y);
    }
    checkBerryCollision(cell);
    if (keybrdPressFlag) checkSelfCollision(snake.head, cell);
  }
};

const drawBerry = () => {
  context.fillStyle = colorColl.berry.color || berryColor.value;
  context.fillRect(berry.x, berry.y, berry.sizeBerry, berry.sizeBerry);
};

const checkWin = () => {
  const cellsByX = canvas.width / snake.sizeCell;
  const cellsByY = canvas.height / snake.sizeCell;
  const area = cellsByX * cellsByY;
  if (snake.maxTails === area) {
    roomData.winsCount++;
    setSound(sounds.win);
    refreshGame();
  }
};

const gameLoop = () => {
  setInterval(() => {
    if (!isPaused && document.hasFocus()) {
      if (keybrdPressFlag) countTime(time, maxTime, frameTime);
      context.clearRect(0, 0, canvas.width, canvas.height);
      mapTiler();
      drawSnake();
      drawBerry();
      checkWin();
      score.innerHTML = `Score: ${roomData.scoreCount}`;
      record.innerHTML = `Best score: ${roomData.recordCount}`;
      wins.innerHTML = `Wins: ${roomData.winsCount}`;
    }
  }, frameTime);
};
gameLoop();
