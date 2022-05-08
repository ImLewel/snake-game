const myAudio = new Audio('./music/ambientMusic.mp3');
const musicSlider = document.querySelector('#musicSlider');
const musicPic = document.querySelector('#musicPic');
myAudio.volume = 0.5;
const setVolume = () => {
  musicSlider.oninput = () => {
    myAudio.volume = musicSlider.value/10;
    myAudio.muted = false;
    myAudio.play();
    if (myAudio.volume === 0) musicPic.src = './volumeIcons/volumeOff.png';
    else musicPic.src = './volumeIcons/volumeOn.png';
  }
}
setVolume();