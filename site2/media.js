'use strict';

const myAudio = new Audio('./music/ambientMusic.mp3');
const musicSlider = document.querySelector('#musicSlider');
const musicPic = document.querySelector('#musicPic');
const divider = 10;
const onOffPaths = {
  off: './volumeIcons/volumeOff.png',
  on: './volumeIcons/volumeOn.png',
};
myAudio.volume = 0;

const setVolume = () => {
  musicSlider.oninput = () => {
    myAudio.volume = musicSlider.value / divider;
    if (myAudio.volume === 0) {
      musicPic.src = onOffPaths.off;
      myAudio.muted = true;
      myAudio.pause();
    } else {
      musicPic.src = onOffPaths.on;
      myAudio.muted = false;
      myAudio.play();
    }
  };
};
setVolume();
