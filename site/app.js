'use strict';

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

