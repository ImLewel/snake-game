'use strict';

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
  mobController.onclick = (event) => {
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

