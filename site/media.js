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
  setVolume() {
    this.slider.oninput = () => {
      this.file.volume = this.slider.value / this.divider;
      if (this.file.volume === 0) {
        this.mute();
        this.file.pause();
      } else this.unMute();
    };
  }
  tryPlay() {
    this.file.play();
  }
  callEvent() {
    this.slider.onmouseenter = () => {
      this.tryPlay();
    };
  }
}

const musicPlayer = new SoundController(
  '#musicSlider',
  '#musicPic',
  './music/ambientMusic.mp3'
);
musicPlayer.setVolume();
musicPlayer.callEvent();
