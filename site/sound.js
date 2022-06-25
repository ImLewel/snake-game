'use strict';

const sounds = {
  none: '',
  berry: './sound/berry.mp3',
  win: './sound/win.mp3',
  gameover: './sound/gameover.mp3',
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
