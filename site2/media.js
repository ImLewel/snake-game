'use strict';

class SoundController {
  constructor(sliderClass, picClass, path) {
    this.file = new Audio(path);
    this.slider = document.querySelector(sliderClass);
    this.pic = document.querySelector(picClass);
    this.divider = 10;
    this.file.volume = 0;
    this.onOffPaths = {
      off: './volumeIcons/volumeOff.png',
      on: './volumeIcons/volumeOn.png',
    };
  }
  unMute() {
    this.pic.src = this.onOffPaths.on;
    this.file.muted = false;
  }
  mute() {
    this.pic.src = this.onOffPaths.off;
    this.file.muted = true;
  }
}

class MusicPlayer extends SoundController {
  setVolume() {
    this.slider.oninput = () => {
      this.file.volume = this.slider.value / this.divider;
      if (this.file.volume === 0) {
        super.mute();
        this.file.pause();
      } else {
        super.unMute();
        this.file.play();
      }
    };
  }
}

const music = new MusicPlayer('#musicSlider', '#musicPic', './music/ambientMusic.mp3');
music.setVolume();
