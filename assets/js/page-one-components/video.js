document.addEventListener("DOMContentLoaded", () => {
  const triggers = [
    {
      isOpenFullscreen: true,
      selector: ".js-video",
    },
    {
      isOpenFullscreen: true,
      selector: ".hero-video-block__btn-play--primary",
    },
    {
      isOpenFullscreen: false,
      selector: ".hero-video-block__btn-play--secondary",
    },
  ];

  window.addEventListener("load", function () {
    init();
  });

  function init() {
    triggers.forEach((trigger) => {
      const triggerElements = document.querySelectorAll(trigger.selector);
      if (!triggerElements || triggerElements.length === 0) return;

      triggerElements.forEach((element) => {
        const video = element.tagName === "VIDEO" ? element : getVideo(element);
        if (!video) return;

        video.removeEventListener("play", hanleOnPlay);
        video.addEventListener("play", hanleOnPlay);

        video.removeEventListener("pause", hanleOnPlay);
        video.addEventListener("pause", hanleOnPlay);

        element.addEventListener("click", function (e) {
          e.preventDefault();
          if (trigger.isOpenFullscreen) {
            playVideoInFullscreenMode(video);
          } else {
            toggleVideoState(video);
          }
        });
      });
    });
  }

  function getVideo(triggerElement) {
    const container = triggerElement.closest(".hero-video-block");
    if (!container) return null;
    const device = window.innerWidth <= 768 ? "mobile" : "desktop";
    const video = container.querySelector(`video.main__hero--video-${device}`);
    return video ?? container.querySelector("video");
  }

  function hanleOnPlay() {
    const videoContainer = this.closest(".hero-video-block");
    if (!videoContainer) return;

    if (this.paused) {
      videoContainer.classList.remove("hero-video-block--playing");
    } else {
      videoContainer.classList.add("hero-video-block--playing");
    }
  }

  function toggleVideoState(video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function playVideoInFullscreenMode(video) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen();
    }
    video.play();
  }

  function HandleFullScreen(flag) {
    const videos = document.querySelectorAll(".js-video");
    if (videos) {
      videos.forEach((video) => {
        if (flag) {
          video.classList.add("expanded");
          video.muted = false;
        } else {
          video.classList.remove("expanded");
        }
      });
    }
  }

  document.addEventListener(
    "fullscreenchange",
    function () {
      document.fullscreen ? HandleFullScreen(true) : HandleFullScreen(false);
    },
    false
  );

  document.addEventListener(
    "mozfullscreenchange",
    function () {
      document.mozFullScreen ? HandleFullScreen(true) : HandleFullScreen(false);
    },
    false
  );

  document.addEventListener(
    "webkitfullscreenchange",
    function () {
      document.webkitIsFullScreen
        ? HandleFullScreen(true)
        : HandleFullScreen(false);
    },
    false
  );
});
