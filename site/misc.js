'use strict';

const widthBtns = {};
[widthBtns.normal, widthBtns.wide] = Object.values(widthSelector);

const setFieldSize = (normalMult, multX, multY) => {
  if (!keybrdPressFlag) {
    let currMultX = multX;
    let currMultY = multY;
    onclick = (event) => {
      if (event.target.id === widthBtns.normal.id) {
        currMultX = normalMult;
        currMultY = normalMult;
      } else {
        currMultX = multX;
        currMultY = multY;
      }
      console.log(currMultX);
      canvas.width = roomData.width * currMultX;
      canvas.height = roomData.height * currMultY;
      canvas.style.width = `${roomData.width * currMultX}px`;
      canvas.style.height = `${roomData.height * currMultY}px`;
    };
  }
};
setFieldSize(1, 1.5, 1.25);

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
