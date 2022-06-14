'use strict';

const canvas = document.getElementById('game-canvas');
const widthSelector = document.querySelectorAll('.fieldSizeBtn');
const headColor = document.querySelector('#headColor');
const bodyColor = document.querySelector('#bodyColor');
const faceExample = document.querySelector('#faceExample');
const tileExample = document.querySelector('#tileExample');
const score = document.getElementById('score');
const record = document.getElementById('record');
const wins = document.getElementById('wins');
const context = canvas.getContext('2d');
const faceSlider = document.getElementById('faceSlider');
const tileSlider = document.getElementById('tileSlider');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('dataField');
const mobController = document.getElementById('mobController');
const arrows = document.querySelectorAll('.arrow');
const UA = navigator.userAgent;
mobController.style.display = 'none';

const roomData = {
  step: 0,
  maxStep: 10,
  width: 512,
  height: 384,
  scoreCount: 0,
  recordCount: 0,
  winsCount: 0,
  avaliableBonus:  { small: 1, big: 2 },
  currBonus: 0,
  settingsOpened: true,
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

for (const os in osColl) {
  if (UA.match(osColl[os]) && window.innerWidth <= maxMobRes.width) {
    getCanvasDimensions();
    arrowsShown = true;
    roomData.settingsOpened = false;
    settingsMenu.style.display = 'none';
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

const berry = {
  x: 0,
  y: 0,
  avaliableSize: { small: 8, big: 16 },
  sizeBerry: 8,
};

const align = () => ((snake.sizeCell - berry.sizeBerry) / 2);
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

const tileColl = [{ slider: faceSlider, ex: faceExample, name: 'faces' },
  { slider: tileSlider, ex: tileExample, name: 'tiles' }];
const getCustoms = (coll) => {
  for (const obj of coll) {
    obj.slider.oninput = () => {
      const dir = obj.name;
      const subDir = obj.name.slice(0, 4);
      obj.ex.src = `./${dir}/${subDir + obj.slider.value}.png`;
    };
  }
};
getCustoms(tileColl);

const colorColl = {
  head: { slider: headColor, color: null },
  body: { slider: bodyColor, color: null },
};

const getColor = () => {
  for (const obj in colorColl) {
    colorColl[obj].slider.oninput = () => {
      colorColl[obj].color = colorColl[obj].slider.value;
    };
  }
};
getColor();

const mapTiler = () => {
  const pattern = context.createPattern(tileColl[1].ex, 'repeat');
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
const keysColl = {
  w: { key: 'KeyW', dirX: 0, dirY: -snake.stepSize },
  s: { key: 'KeyS', dirX: 0, dirY: snake.stepSize },
  a: { key: 'KeyA', dirX: -snake.stepSize, dirY: 0 },
  d: { key: 'KeyD', dirX: snake.stepSize, dirY: 0 },
};

const mobileArrows = {
  up: { id: 'up', dirX: 0, dirY: -snake.stepSize },
  down: { id: 'down', dirX: 0, dirY: snake.stepSize },
  left: { id: 'left', dirX: -snake.stepSize, dirY: 0 },
  right: { id: 'right', dirX: snake.stepSize, dirY: 0 },
};

const control = (coll) => {
  document.addEventListener('keydown', (e) => {
    for (const letter in coll) {
      if (e.code === coll[letter].key) {
        snake.dirX = coll[letter].dirX;
        snake.dirY = coll[letter].dirY;
        keybrdPressFlag = true;
      }
    }
  });
};
control(keysColl);

const setFlag = () => keybrdPressFlag = true;

const mobileInput = (coll) => {
  for (const arrow of arrows) {
    arrow.onclick = () => {
      setFlag();
      for (const elem in coll) {
        if (coll[elem].id === arrow.id) {
          snake.dirX = coll[elem].dirX;
          snake.dirY = coll[elem].dirY;
        }
      }
    };
  }
};

if (arrowsShown === true) {
  mobController.style.display = '';
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

const refreshGame = () => {
  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 20;
  snake.dirX = 0;
  snake.dirY = 0;
  roomData.scoreCount = 0;
  berryPos();
  keybrdPressFlag = false;
};

restartBtn.onclick = () => refreshGame();

settingsBtn.onclick = () => {
  if (roomData.settingsOpened === false) {
    settingsMenu.style.display = '';
    roomData.settingsOpened = true;
  } else {
    settingsMenu.style.display = 'none';
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
  context.fillStyle = '#CF1B84';
  context.fillRect(berry.x, berry.y, berry.sizeBerry, berry.sizeBerry);
};

const checkWin = () => {
  const cellsByX = canvas.width / snake.sizeCell;
  const cellsByY = canvas.height / snake.sizeCell;
  const area = cellsByX * cellsByY;
  if (snake.maxTails === area) {
    roomData.winsCount++;
    refreshGame();
  }
};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);
  if (!isPaused) {
    if (++roomData.step < roomData.maxStep) return;
    roomData.step = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    mapTiler();
    drawSnake();
    drawBerry();
    checkWin();
    score.innerHTML = `Score: ${roomData.scoreCount}`;
    record.innerHTML = `Best score: ${roomData.recordCount}`;
    wins.innerHTML = `Wins: ${roomData.winsCount}`;
  }
};
requestAnimationFrame(gameLoop);

