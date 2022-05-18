const myAudio = new Audio('./music/ambientMusic.mp3');
const musicSlider = document.querySelector('#musicSlider');
const musicPic = document.querySelector('#musicPic');
myAudio.volume = 0.5;
const setVolume = () => {
  musicSlider.oninput = () => {
    myAudio.volume = musicSlider.value/10;
    if (myAudio.volume === 0) {
      musicPic.src = './volumeIcons/volumeOff.png';
      myAudio.muted = true;
    } else {
      musicPic.src = './volumeIcons/volumeOn.png';
      myAudio.muted = false;
      myAudio.play();
    }
  }
}
setVolume();