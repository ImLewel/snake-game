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

const roomData = {
  step: 0,
  maxStep: 10,
  width: 512,
  height: 384,
  scoreCount: 0,
  recordCount: 0,
  winsCount: 0,
  bonus: 0,
}

canvas.width = roomData.width;
canvas.height = roomData.height;
canvas.style.width = `${roomData.width}px`;
canvas.style.height = `${roomData.height}px`;

const snake = {
  sizeCell: 16,
  x: 160,
  y: 160,
  dirX: 0,
  dirY: 0,
  stepSize: 16,
  tails: [],
  maxTails: 20,
  face: null,
}

const berry = {
  x: 0,
  y: 0,
  avaliableSize: [8, 8, 8, 16],
  sizeBerry: 8,
}

const align = () => { return ((snake.sizeCell - berry.sizeBerry) / 2); }
let indent;

const getRandomInt = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

const gameLoop = () => {
    requestAnimationFrame(gameLoop);
    if (!isPaused){
    if (++roomData.step < roomData.maxStep) return;
    roomData.step = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    mapTiler();
    drawSnake();
    drawBerry();
    score.innerHTML = `Score: ${roomData.scoreCount}`;
    record.innerHTML = `Best score: ${roomData.recordCount}`;
    wins.innerHTML = `Wins: ${roomData.winsCount}`;
  }
}
requestAnimationFrame(gameLoop);

const drawSnake = () => {
  snake.x += snake.dirX;
  snake.y += snake.dirY;
  collisionBorder();
  if (faceSlider.value != 0) snake.face = faceExample;
  else snake.face = null;
  snake.tails.unshift({ x: snake.x, y: snake.y });
  head = snake.tails[0];
  if (snake.tails.length > snake.maxTails) snake.tails.pop();
  for (let cell of snake.tails) {
    setSnakeColor(cell);
    if (snake.face != null) context.drawImage(snake.face, head.x, head.y);
    checkBerryCollision(cell);
    if (keybrdPressFlag) checkSelfCollision(head, cell);
  }
}

const setSnakeColor = (cell) => {
  if (cell === head) 
    context.fillStyle = colorColl.head.part || headColor.value;
  else
   context.fillStyle = colorColl.body.part || bodyColor.value;
  context.fillRect(cell.x, cell.y, snake.sizeCell, snake.sizeCell);
}

const checkBerryCollision = (cell) => {
  if (cell.x + indent == berry.x && cell.y + indent == berry.y) {
    if (berry.sizeBerry === berry.avaliableSize[0]) roomData.bonus = 1;
    else roomData.bonus = 2;
    if (roomData.scoreCount >= roomData.recordCount) roomData.recordCount+=roomData.bonus;
    roomData.scoreCount+=roomData.bonus;
    snake.maxTails+=roomData.bonus;
    berryPos();
  }
}

const checkSelfCollision = (head, cell) => {
  if (head != cell && head.x === cell.x && head.y === cell.y) refreshGame();
}

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
}

const drawBerry = () => {
  context.fillStyle = "#CF1B84";
  context.fillRect(berry.x, berry.y, berry.sizeBerry, berry.sizeBerry);
}

const berryPos = () => {
  let index = getRandomInt(0, berry.avaliableSize.length - 1);
  berry.sizeBerry = berry.avaliableSize[index];
  indent = align();
  berry.x = getRandomPos(canvas.width);
  berry.y = getRandomPos(canvas.height);
}

const getRandomPos = (dimension) => {
  const pos = ((getRandomInt(0, (dimension - snake.sizeCell) / snake.sizeCell) * snake.sizeCell) + indent);
  return pos;
}

berryPos();

const collisionBorder = () => {
  if (snake.x < 0) snake.x = canvas.width - snake.sizeCell;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - snake.sizeCell;
  else if (snake.y >= canvas.height) snake.y = 0;
}

let keybrdPressFlag = false;
const keysColl = {
  w: ["KeyW", 0, -snake.stepSize],
  s: ["KeyS", 0,  snake.stepSize],
  a: ["KeyA", -snake.stepSize, 0],
  d: ["KeyD",  snake.stepSize, 0],
}

document.addEventListener("keydown", e => {
  for (const key in keysColl) {
    if (e.code == keysColl[key][0]) {
      snake.dirX = keysColl[key][1];
      snake.dirY = keysColl[key][2];
      keybrdPressFlag = true;
    }
  }
});

const colorColl = {
  head: {slider: headColor, part: null},
  body: {slider: bodyColor, part: null},
}

const getColor = () => {
  for (let obj in colorColl) {
    colorColl[obj].slider.oninput = () => {
      colorColl[obj].part = colorColl[obj].slider.value;
    }
  }
}
getColor();

const getFieldWidth = () => {
  for (let elem of widthSelector) {
    elem.onclick = () => {
      if (!keybrdPressFlag) {
        if (Array.from(widthSelector).indexOf(elem) === 0) {
          canvas.width = roomData.width;
          canvas.height = roomData.height;
          canvas.style.width = `${roomData.width}px`;
          canvas.style.height = `${roomData.height}px`;
        }
        else {
          canvas.width = roomData.width * 1.5;
          canvas.height = roomData.height * 1.25;
          canvas.style.width = `${roomData.width * 1.5}px`;
          canvas.style.height = `${roomData.height * 1.25}px`;
        }
      }
    }
  }
}
getFieldWidth();

const tileColl = [{slider: faceSlider, ex: faceExample, name: 'faces'},
 {slider: tileSlider, ex: tileExample, name: 'tiles'}];
const getCustoms = (coll) => {
  for (let obj of coll) {
    obj.slider.oninput = () => {
      obj.ex.src = `./${obj.name}/${obj.name.substring(0,4) + obj.slider.value}.png`;
    }
  }
}
getCustoms(tileColl);

const mapTiler = () => {
  const pattern = context.createPattern(tileColl[1].ex, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

let isPaused = false;
const pauseIco = './icons/pause.png';
const continueIco = './icons/continue.png';
pauseBtn.onclick = () => {
  if (!isPaused) {
    isPaused = true;
    pauseBtn.src = continueIco;
  }
  else {
    isPaused = false;
    pauseBtn.src = pauseIco;
  }
}

restartBtn.onclick = () => refreshGame();

const checkWin = () => {
  if (snake.maxTails === (canvas.width / snake.sizeCell) * (canvas.height / snake.sizeCell)) {
    roomData.winsCount++;
    refreshGame();
  }
}

