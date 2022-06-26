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

const snake = {
  sizeCell: 16,
  x: 160,
  y: 160,
  dirX: 0,
  dirY: 0,
  stepSize: 16,
  tails: [],
  maxTails: 10,
  head: null,
  face: null,
};

const berry = {
  x: 0,
  y: 0,
  avaliableSize: { small: 8, big: 16 },
  sizeBerry: 8,
};

timer.innerHTML = roomData.initialTime;
