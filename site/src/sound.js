'use strict';

const sounds = {
  none: '',
  berry: '../site/sound/berry.mp3',
  win: '../site/sound/win.mp3',
  gameover: '../site/sound/gameover.mp3',
};

const soundPlayer = new SoundController(
  '#soundSlider',
  '#soundPic',
  sounds.none
);
soundPlayer.setVolume();

const setSound = (path) => {
  soundPlayer.file.src = path;
  soundPlayer.tryPlay();
};
