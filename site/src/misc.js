'use strict';

const widthBtns = {};
[widthBtns.normal, widthBtns.wide] = Object.values(widthSelector);

const coll = {};

const setFieldSize = (normalMult, multX, multY) => {
  let currId;
  [coll.currMultX, coll.currMultY, coll.prevMultX] = [normalMult];
  onclick = (event) => {
    if (!keybrdPressFlag) {
      currId = event.target.id;
      coll.prevMultX = coll.currMultX;
      if (currId === widthBtns.normal.id) {
        coll.currMultX = normalMult;
        coll.currMultY = normalMult;
      } else if (currId === widthBtns.wide.id) {
        coll.currMultX = multX;
        coll.currMultY = multY;
      }
      if (coll.currMultX !== coll.prevMultX) {
        canvas.width = roomData.width * coll.currMultX;
        canvas.height = roomData.height * coll.currMultY;
        canvas.style.width = `${roomData.width * coll.currMultX}px`;
        canvas.style.height = `${roomData.height * coll.currMultY}px`;
      }
    }
  };
};
setFieldSize(1, 1.5, 1.25);

const tileColl = {
  face: { slider: faceSlider, ex: faceExample, name: 'faces' },
  tile: { slider: tileSlider, ex: tileExample, name: 'tiles' },
};
const getCustoms = (coll) => {
  for (const obj of Object.keys(coll)) {
    coll[obj].slider.oninput = () => {
      const main = '../site/';
      const dir = coll[obj].name;
      const subDir = coll[obj].name.slice(0, 4);
      const currFile = subDir + coll[obj].slider.value;
      coll[obj].ex.src = `${main}/${dir}/${currFile}.png`;
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
