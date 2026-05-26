/* Variables and constants */
//buttons
const prevButton = document.querySelector(".prev");
const playButton = document.querySelector(".play");
const nextButton = document.querySelector(".next");
const playButtonImg = document.querySelector(".playButtonImg");
const queue = document.querySelector(".queue");
const order = document.querySelector(".order");
const orderDialogue = document.querySelector(".orderDialogue");

// audio element and img
const audio = document.getElementById("audio");
const songImg = document.getElementById("songImg");

// song detail (title, singer)
const songTitle = document.querySelector(".songTitle");
const songSinger = document.querySelector(".songSinger");

// sound progress and button(mute, unmute)
const soundbutton = document.querySelector(".soundbutton");
const soundContainer = document.querySelector(".soundContainer");
const soundProgress = document.querySelector(".soundProgress");
const soundProgressDot = document.querySelector(".soundProgressDot");
const sButton = document.querySelector(".sButton");

// player current time progress
const progressContainer = document.querySelector(".progressContainer");
const currentTimeProgress = document.querySelector(".currentTimeProgress");
const songCurrentTime = document.querySelector(".songCurrentTime");
const songTotalTime = document.querySelector(".songTotalTime");
const timeProgressDot = document.querySelector(".timeProgressDot");

// states of song playing
let currentSongIndex = 0;
let isPlaying = false;
let isMute = false;
let islengthChanged = false;
let queueSong = 0;

//width of soundContainer and time progress container
let soundContainerWidth = soundContainer.clientWidth;
let progressContainerWidth = progressContainer.clientWidth;

// songs list
const songList = [
  {
    title: "Dekhte Dekhte",
    singer: "Atif Aslam",
    file: "songs/atif_dekhte_dekhte.mp3",
    img: "songsImg/dekhte_dekhte.jpg",
  },
  {
    title: "Ajj Din Chadheya",
    singer: "Atif Aslam",
    file: "songs/ajj_din_chadheya.mp3",
    img: "songsImg/aaj-din-chadeya.jpg",
  },
  {
    title: "Aisa Banna Sawarna",
    singer: "Roop Kumar Rathod",
    file: "songs/aisa_banna.mp3",
    img: "songsImg/aisa_banna.jpg",
  },
  {
    title: "Afghan Jalebi - Phantom",
    singer: "Asrar",
    file: "songs/afghan_jalebi.mp3",
    img: "songsImg/afghan_jalebi.jpg",
  },
  {
    title: "Kun Faya Kun",
    singer: "A.R. Rahman",
    file: "songs/kun_faya_kun.mp3",
    img: "songsImg/kun_faya_ku.jpg",
  },
  {
    title: "Dost ka Dost Hai - Mushaira",
    singer: "Iqbal Ashar",
    file: "songs/iqbal_ashar.mp3",
    img: "songsImg/iqbal_ashar.jpg",
  },
];

// default songs is at index 0 and volume at 0.5(50%)
setAudio(0);
setSoundProgress(50);

// function to play song at current index
function playSongs(currentSongIndex) {
  playButtonImg.src = "img/pause.png";
  audio.play();
  isPlaying = true;
}

// set audio src, song details, image
function setAudio(currentSongIndex) {
  audio.src = encodeURI(songList[currentSongIndex].file);
  songTitle.textContent = songList[currentSongIndex].title;
  songSinger.textContent = songList[currentSongIndex].singer.toUpperCase();
  songImg.src = songList[currentSongIndex].img;
}

// toggle to play
playButton.addEventListener("click", (e) => {
  if (!isPlaying) {
    playSongs(currentSongIndex);
  } else {
    playButtonImg.src = "img/play.png";
    audio.pause();
    isPlaying = false;
  }
});

// previous button
prevButton.addEventListener("click", (e) => {
  if (currentSongIndex > 0 && currentSongIndex < songList.length) {
    currentSongIndex = currentSongIndex - 1;
  } else {
    currentSongIndex = songList.length - 1;
  }
  setAudio(currentSongIndex);
  playSongs(currentSongIndex);
});

// next button
nextButton.addEventListener("click", (e) => {
  if (currentSongIndex >= 0 && currentSongIndex < songList.length - 1) {
    currentSongIndex = currentSongIndex + 1;
  } else {
    currentSongIndex = 0;
  }
  setAudio(currentSongIndex);
  playSongs(currentSongIndex);
});

// song sound button
soundbutton.addEventListener("click", isAudioMute);

// function to set mute and unmute and their volume
function isAudioMute() {
  if (!isMute) {
    soundbutton.src = "img/mute.png";
    setSoundProgress(0);
  } else {
    soundbutton.src = "img/lowVolume.png";
    setSoundProgress(20);
  }
}

// set sound bar
function setSoundProgress(widthPercent) {
  widthPercent = Math.max(0, Math.min(widthPercent, 100));

  soundProgress.style.width = `${widthPercent}%`;
  soundProgressDot.style.left = `${widthPercent}%`;

  audio.volume = widthPercent / 100;

  if (widthPercent == 0) {
    soundbutton.src = "img/mute.png";
    isMute = true;

    soundProgressDot.style.left = `${widthPercent}%`;
  } else if (widthPercent <= 20) {
    soundbutton.src = "img/lowVolume.png";
    isMute = false;

    soundProgressDot.style.left = `${widthPercent - 1}%`;
  } else {
    soundbutton.src = "img/highVolume.png";
    isMute = false;
    soundProgressDot.style.left = `${widthPercent - 1}%`;
  }
}

// sound bar
soundContainer.addEventListener("click", setWidth);
// soundContainer.addEventListener("mousemove", setWidth);
// soundContainer.addEventListener("mousemove", setWidth);

// function to set sound bar width
function setWidth(e) {
  const rect = soundContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const widthPercent = (clickX / rect.width) * 100;

  setSoundProgress(widthPercent);
}

/* audio progress seek bar */
// set song length
audio.addEventListener("loadedmetadata", () => {
  songTotalTime.textContent = formatAudioTime(audio.duration);
});

// audio time calculate
audio.addEventListener("timeupdate", () => {
  // set current time
  songCurrentTime.textContent = ` ${formatAudioTime(audio.currentTime)}`;

  // set progress bar to current time
  setProgressWidth(audio.currentTime, audio.duration);

  // auto next
  if (
    audio.currentTime == audio.duration &&
    queueSong !== 1 &&
    queueSong !== 2
  ) {
    currentSongIndex++;
    setAudio(currentSongIndex);
  }
});

// function to format the above calculated second
function formatAudioTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // if the number is less than 10
  let formattedMinutes = null;

  if (minutes < 10) {
    formattedMinutes = "0" + minutes;
  } else {
    formattedMinutes = minutes;
  }

  let formattedSeconds = null;

  if (remainingSeconds < 10) {
    formattedSeconds = "0" + remainingSeconds;
  } else {
    formattedSeconds = remainingSeconds;
  }
  return `${formattedMinutes}:${formattedSeconds}`;
}

// function to set width of progress
function setProgressWidth(audioCurrentTime, songLength) {
  // const widthPercent = (audioCurrentTime / progressContainerWidth) * 100;
  const widthPercent = (audioCurrentTime / songLength) * 100;
  currentTimeProgress.style.width = `${widthPercent}%`;
  timeProgressDot.style.display = "inline";
  timeProgressDot.style.left = `${widthPercent - 1}%`;
}

// audio time bar
progressContainer.addEventListener("click", handleProgressClick());

function handleProgressClick() {
  setProgressWidth(audio.currentTime, audio.duration);
}

progressContainer.addEventListener("click", (e) => {
  const widthPercent = e.offsetX / progressContainer.clientWidth;

  if (!isNaN(audio.duration)) {
    audio.currentTime = widthPercent * audio.duration;
  }
});

// random loop queue song
queue.addEventListener("click", (e) => {
  queueSong++;
  if (queueSong == 1) {
    order.src = "img/loop.png";
    orderDialogue.textContent = "Single Loop";
  } else if (queueSong == 2) {
    order.src = "img/randomPlay.png";
    orderDialogue.textContent = "Shuffle Play";
  } else {
    order.src = "../img/playQueue.png";
    orderDialogue.textContent = "Playlist Play";
    queueSong = 0;
  }

  orderDialogue.style.display = "block";

  setTimeout(function () {
    orderDialogue.style.display = "none";
  }, 1000); // 3000ms delay
});

// set audio or song as per order i.e loop, random
audio.addEventListener("ended", () => {
  if (queueSong === 1) {
    // Loop current song
    audio.currentTime = 0;
    audio.play();
    setProgressWidth(audio.currentTime, audio.duration);
    return;
  }

  if (queueSong === 2) {
    // Shuffle
    currentSongIndex = getRandomSongIndex();
  } else {
    // Normal playlist
    currentSongIndex++;

    if (currentSongIndex >= songList.length) {
      currentSongIndex = 0;
    }
  }
  setAudio(currentSongIndex);
  playSongs(currentSongIndex);
});

function getRandomSongIndex() {
  if (songList.length <= 1) return 0;

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songList.length);
  } while (randomIndex === currentSongIndex);

  return randomIndex;
}
