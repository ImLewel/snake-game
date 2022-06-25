'use strict';

const gameLoop = () => {
  setInterval(() => {
    if (!isPaused && document.hasFocus()) {
      if (keybrdPressFlag) countTime(time, maxTime, roomData.frameTime);
      context.clearRect(0, 0, canvas.width, canvas.height);
      mapTiler();
      drawSnake();
      drawBerry();
      checkWin();
      score.innerHTML = `Score: ${roomData.scoreCount}`;
      record.innerHTML = `Best score: ${roomData.recordCount}`;
      wins.innerHTML = `Wins: ${roomData.winsCount}`;
    }
  }, roomData.frameTime);
};
gameLoop();
