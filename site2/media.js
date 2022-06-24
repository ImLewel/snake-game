'use strict';

class SoundController {
  constructor(path, sliderClass) {
    this.file = new Audio(path);
    this.musicSlider = document.querySelector(sliderClass);
    this.musicPic = document.querySelector('#musicPic');
    this.divider = 10;
    this.file.volume = 0;
    this.onOffPaths = {
      off: './volumeIcons/volumeOff.png',
      on: './volumeIcons/volumeOn.png',
    };
  }
  start() {
    this.musicPic.src = this.onOffPaths.on;
    this.file.muted = false;
    this.file.play();
  }
  stop() {
    this.musicPic.src = this.onOffPaths.off;
    this.file.muted = true;
    this.file.pause();
  }
}

class MusicPlayer extends SoundController {
  setVolume() {
    this.musicSlider.oninput = () => {
      this.file.volume = this.musicSlider.value / this.divider;
      if (this.file.volume === 0) {
        super.stop();
      } else {
        super.start();
      }
    };
  }
}

const music = new MusicPlayer('./music/ambientMusic.mp3', '#musicSlider');
music.setVolume();
