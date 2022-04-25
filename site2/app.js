const canvas = document.getElementById('game-canvas');
const widthSelector = document.querySelectorAll('.fieldSizeBtn');
const headColor = document.querySelector('#headColor');
const bodyColor = document.querySelector('#bodyColor');
const headExample = document.querySelector('#head');
const bodyExample = document.querySelector('#body');
const score = document.getElementById('score');
const record = document.getElementById('record');
const context = canvas.getContext('2d');
  width = 512,
  height = 384;
let scoreCount = 0,
  recordCount = 0,
  bonus;

canvas.width = width;
canvas.height = height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const fieldProperties = {
  step: 0,
  maxStep: 10,
}

const snake = {
  sizeCell: 16,
  x: 160,
  y: 160,
  dirX: 0,
  dirY: 0,
  stepSize: 16,
  tails: [],
  maxTails: 20,
  headColor: "blue",
  bodyColor: "midnightblue",
}

const berry = {
  x: 0,
  y: 0,
  avaliableSize: [8, 16],
  sizeBerry: 8,
}

const align = () => { return ((snake.sizeCell - berry.sizeBerry) / 2); }
let indent;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

const gameLoop = () => {
  requestAnimationFrame(gameLoop);

  if (++fieldProperties.step < fieldProperties.maxStep) return;
  fieldProperties.step = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawBerry();
  getColor();
  score.innerHTML = `Your current score is ${scoreCount}`;
  record.innerHTML = `Your record was ${recordCount}`;
}
requestAnimationFrame(gameLoop);

const drawSnake = () => {
  snake.x += snake.dirX;
  snake.y += snake.dirY;
  collisionBorder()
  snake.tails.unshift({ x: snake.x, y: snake.y });
  head = snake.tails[0];
  if (snake.tails.length > snake.maxTails) snake.tails.pop();
  for (let cell of snake.tails) {
    if (cell === head) context.fillStyle = snake.headColor;
    else context.fillStyle = snake.bodyColor;
    context.fillRect(cell.x, cell.y, snake.sizeCell, snake.sizeCell);
    if (cell.x + indent == berry.x && cell.y + indent == berry.y) {
      if (berry.sizeBerry === berry.avaliableSize[0]) bonus = 1;
      else bonus = 2;
      scoreCount+=bonus;
      if (scoreCount > recordCount) recordCount+=bonus;
      snake.maxTails+=bonus;
      berryPos();
    }
    if (keybrdPressFlag) checkSelfCollision(head, cell);
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
  scoreCount = 0;
  berryPos();
  keybrdPressFlag = false;
}

const drawBerry = () => {
  context.fillStyle = "#CF1B84";
  context.fillRect(berry.x, berry.y, berry.sizeBerry, berry.sizeBerry);
}

const berryPos = () => {
  berry.sizeBerry = berry.avaliableSize[Math.round(Math.random())];
  indent = align();
  berry.x = (getRandomInt(0, canvas.width / snake.sizeCell) * snake.sizeCell) + indent;
  berry.y = getRandomInt(0, canvas.height / snake.sizeCell) * snake.sizeCell + indent;
}
berryPos();

function collisionBorder() {
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

const snakeColors = ['blue', 'red', 'green', 'lightgreen', 'brown', 'purple', 'pink', 'orange'];
headExample.style.backgroundColor = snakeColors[0];
bodyExample.style.backgroundColor = snakeColors[0];
const getColor = () => {
  headColor.oninput = () => {
    snake.headColor = snakeColors[headColor.value];
    headExample.style.backgroundColor = snakeColors[headColor.value];
  }
  bodyColor.oninput = () => {
    snake.bodyColor = snakeColors[bodyColor.value];
    bodyExample.style.backgroundColor = snakeColors[bodyColor.value];
  }
}

const getFieldWidth = () => {
  for (let elem of widthSelector) {
    elem.onclick = () => {
      if (Array.from(widthSelector).indexOf(elem) === 0) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      else {
        canvas.width = width * 1.5;
        canvas.height = height * 1.25;
        canvas.style.width = `${width * 1.5}px`;
        canvas.style.height = `${height * 1.25}px`;
      }
    }
  }
}
getFieldWidth();