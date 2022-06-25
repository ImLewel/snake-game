'use strict';

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

let isPaused = false;
const playIcons = {
  play: '../site/icons/continue.png',
  pause: '../site/icons/pause.png',
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
