window.addEventListener("load", function () {
  const wrapper = document.querySelector(".wrapper");
  const musicImg = document.querySelector(".img-area img");
  const imgArea = document.querySelector(".img-area");
  const musicName = document.querySelector(".song-details .name");
  const musicArtist = document.querySelector(".song-details .artist");
  const mainAudio = document.querySelector("#main-audio");
  const playPauseBtn = document.querySelector(".play-pause");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const progressBar = document.querySelector(".progress-bar");
  const progressArea = document.querySelector(".progress-area");
  const currentText = document.querySelector(".current");
  const durationText = document.querySelector(".duration");
  const musicList = document.querySelector(".music-list");
  const showMoreBtn = document.querySelector("#more-music");
  const hideMusicBtn = document.querySelector("#close");
  const volumeArea = document.querySelector(".volume-area");
  const volume = document.querySelector(".volume");
  const volumeIcon = document.querySelector(".volume-icon");
  const iconDown = document.querySelector(".icon-down");

  createLiTag();
  const allLiTags = [...document.querySelectorAll("li")];
  //Start here
  let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
  loadMusic(musicIndex);

  function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./assets/images/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `./assets/music/${allMusic[indexNumb - 1].src}.mp3`;
    removeLiTagsRemainedPlaying(indexNumb);
  }
  //play music function
  function playMusic() {
    wrapper.classList.add("paused");
    imgArea.classList.add("active");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
    i = 1;
  }

  //pause music
  function pauseMusic() {
    wrapper.classList.remove("paused");
    imgArea.classList.remove("active");
    musicImg.style = `animation: rotateReverse 0.3s ease-out`;
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
    i = 2;
  }

  function handleChangeMusic(dir) {
    if (dir === 1) {
      musicIndex++;
      if (musicIndex > allMusic.length) {
        musicIndex = 1;
      }
      loadMusic(musicIndex);
      playMusic();
    } else if (dir === -1) {
      musicIndex--;
      if (musicIndex < 1) {
        musicIndex = allMusic.length;
      }
      loadMusic(musicIndex);
      playMusic();
    }
  }

  playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
  });

  nextBtn.addEventListener("click", function () {
    handleChangeMusic(1);
  });
  prevBtn.addEventListener("click", () => {
    handleChangeMusic(-1);
  });

  //update progress bar width according to music current time
  mainAudio.addEventListener("timeupdate", function () {
    const { duration, currentTime } = this;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    //loadeddata cannot be applied to currentTime
    currentText.innerText = format(this.currentTime);
    mainAudio.addEventListener("loadeddata", (e) => {
      durationText.innerText = format(e.target.duration);
    });
  });

  function format(time) {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time - minutes * 60);
    return `0${minutes}:${("0" + seconds).toString().slice(-2)}`;
  }

  //click value suddenly
  progressArea.addEventListener("click", function (e) {
    let actToOffsetX = e.offsetX;
    let barWidth = this.offsetWidth;
    handleProgressValueMove(actToOffsetX, barWidth);
    playMusic();
  });
  function handleProgressValueMove(positionX, DistanceX) {
    mainAudio.currentTime = (positionX / DistanceX) * mainAudio.duration;
  }

  //click move btn
  progressArea.addEventListener("mousedown", function () {
    progressArea.addEventListener("mousemove", handleMouseMove);
  });
  document.addEventListener("mouseup", function () {
    progressArea.removeEventListener("mousemove", handleMouseMove);
  });
  function handleMouseMove(e) {
    let actToOffsetX = e.offsetX;
    let barWidth = this.offsetWidth;
    handleProgressValueMove(actToOffsetX, barWidth);
    playMusic();
  }

  //touch on mobile

  progressArea.addEventListener("touchstart", function () {
    progressArea.addEventListener("touchmove", handleTouchMove);
  });
  progressArea.addEventListener("touchend", function () {
    progressArea.removeEventListener("touchmove", handleTouchMove);
  });
  function handleTouchMove(e) {
    //clientX: distance from touch point to father(wrapper), offsetLeft: distance from child to father(progressArea to wrapper)
    let actToOffsetX = e.touches[0].clientX - this.offsetLeft;
    let barWidth = this.offsetWidth;
    handleProgressValueMove(actToOffsetX, barWidth);
  }

  //space, arrow
  let i = 0;
  document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
      i += 1;
      if (i > 2) {
        i = 1;
      }
      i === 1 ? playMusic() : pauseMusic();
    }

    if (e.key === "ArrowRight") {
      mainAudio.currentTime += 10;
      playMusic();
    }
    if (e.key === "ArrowLeft") {
      mainAudio.currentTime -= 10;
      playMusic();
    }
  });

  //repeat
  const repeatBtn = wrapper.querySelector("#repeat-plist");
  repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    //do different changes on different icon click using switch
    switch (getText) {
      case "repeat":
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song looped");
        break;
      case "repeat_one": //if icon is repeat_one then change it to shuffle
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffle");
        break;
      case "shuffle":
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
        break;
    }
  });

  //above we just changed the icon
  //after the song ended
  mainAudio.addEventListener("ended", function () {
    let getText = repeatBtn.innerText;
    //do different changes on different icon click using switch
    switch (getText) {
      case "repeat": //if this icon is repeat call next music, the next song will play
        handleChangeMusic(1);
        break;
      case "repeat_one": //if icon is repeat_one then change it to shuffle
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
      case "shuffle":
        //generating random index  between max range of array length
        let randIndex;
        do {
          randIndex = Math.floor(Math.random() * allMusic.length + 1);
        } while (musicIndex === randIndex); //this loop run until the next random number is different from the current music index
        musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play;
        loadMusic(musicIndex); //calling loadMusic function
        playMusic(); //calling playMusic function
        break;
    }
  });
  //show/ hide music list
  showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
  });

  hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
  });

  //volume

  //click
  let j = 0;

  volume.addEventListener("change", function () {
    mainAudio.volume = this.value / this.max;
    if (mainAudio.volume === 0) {
      volumeIcon.classList.add("fa-volume-xmark");
      j = 1;
    } else {
      volumeIcon.classList.remove("fa-volume-xmark");
      j = 2;
    }
  });
  volumeIcon.addEventListener("click", function () {
    j++;
    if (j > 2) {
      j = 1;
    }
    if (j === 1) {
      mainAudio.volume = 0;
      volume.value = 0;
      this.classList.add("fa-volume-xmark");
    } else if ((j = 2)) {
      mainAudio.volume = 0.5;
      volume.value = 50;
      this.classList.remove("fa-volume-xmark");
    }
  });

  volume.addEventListener("mousedown", function (e) {
    volume.addEventListener("mousemove", handleChangeVolume);
  });

  document.addEventListener("mouseup", function () {
    volume.removeEventListener("mousemove", handleChangeVolume);
  });

  function handleChangeVolume(event) {
    const x = event.offsetX;
    if (x <= volume.offsetWidth && x >= 0) {
      mainAudio.volume = (x / this.offsetWidth).toFixed(1);
      if (mainAudio.volume === 0) {
        volumeIcon.classList.add("fa-volume-xmark");
        j = 1;
      } else {
        volumeIcon.classList.remove("fa-volume-xmark");
        j = 2;
      }
    }
  }

  //create li according to the array length (final step)
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".music-list") && !e.target.matches("#more-music")) {
      musicList.classList.remove("show");
    }
    if (!e.target.matches(".icon-down")) {
      volumeArea.classList.remove("show");
    }
  });

  function createLiTag() {
  const ulTag = wrapper.querySelector("ul");
    for (let i = 0; i < allMusic.length; i++) {
      let liTag = `
  <li>
    <div class="row">
      <span>
          ${allMusic_2[i].name}
      </span>
      <p>${allMusic_2[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src}" src="./assets/music/${allMusic[i].src}.mp3"></audio>
    <span  id="${allMusic[i].src}" class="audio-duration"></span>
    <div id='bars'>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
        <div class='bar'></div>
    </div>
</li>
`;
      ulTag.insertAdjacentHTML("beforeend", liTag);
      let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`); //music
      let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`); //time
      //thêm audio là để setup time trong li
      liAudioTag.addEventListener("loadeddata", (e) => {
        liAudioDuration.innerText = format(e.target.duration);
      });
    }
  }
  allLiTags.forEach((item) =>
    item.addEventListener("click", function () {
      const liIndex = allLiTags.indexOf(this) + 1;
      musicIndex = liIndex;
      allLiTags.forEach((el) => el.classList.remove("playing"));
      allLiTags[musicIndex - 1].classList.add("playing");
      loadMusic(musicIndex);
      playMusic();
      showMoreBtn.click();
    })
  );

  function removeLiTagsRemainedPlaying(indexMove) {
    allLiTags.forEach((el) => el.classList.remove("playing"));
    allLiTags[indexMove - 1].classList.add("playing");
  }

  // touch volume on mobile
  volume.addEventListener("touchstart", function () {
    volume.addEventListener("touchmove", handleTouchVolume);
  });

  volume.addEventListener("touchend", function () {
    this.removeEventListener("touchmove", handleTouchVolume);
  });

  function handleTouchVolume(e) {
    const touchX = e.touches[0].clientX;
    if (touchX >= 0 && touchX <= this.offsetWidth) {
      mainAudio.volume = Number((touchX / this.offsetWidth).toFixed(1));
      if (mainAudio.volume === 0) {
        volumeIcon.classList.add("fa-volume-xmark");
        j = 1;
      } else {
        volumeIcon.classList.remove("fa-volume-xmark");
        j = 2;
      }
    }
  }

  iconDown.addEventListener("click", function () {
    volumeArea.classList.toggle("show");
  });
});
