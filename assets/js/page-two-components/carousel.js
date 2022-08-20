window.veewooCarousel =
  window.veewooCarousel ||
  (function () {
    const carousels = {};

    window.veewooEventHandlers?.add("carouselModule", _init, 1);

    function _init() {
      let carouselContainers = document.querySelectorAll(".veewoo-o-carousel");

      for (let carousel of carouselContainers) {
        const swiper = carousel.querySelector(".swiper");
        const paginationElement = carousel.querySelector(
          ".veewoo-o-carousel__pagination"
        );

        if (swiper.classList.contains("swiper-initialized")) continue;

        const isMultipleSlides =
          swiper.querySelectorAll(".swiper-slide").length > 1;

        const hasNavigation =
          carousel.dataset.hasNavigation === "true" || false;

        new window.Swiper(swiper, {
          speed: 400,
          spaceBetween: 40,
          autoHeight: true,
          navigation: !hasNavigation
            ? false
            : {
                nextEl: carousel.querySelector(
                  ".veewoo-o-carousel__button-next"
                ),
                prevEl: carousel.querySelector(
                  ".veewoo-o-carousel__button-prev"
                ),
              },
          touchMoveStopPropagation: false,
          autoplay: isMultipleSlides
            ? !!swiper.querySelector(".swiper-slide[data-swiper-autoplay]")
            : false,
          pagination:
            !isMultipleSlides || !paginationElement
              ? false
              : {
                  el: paginationElement,
                  clickable: true,
                  bulletActiveClass: "veewoo-o-carousel__bullet--active",
                  bulletClass: "veewoo-o-carousel__bullet",
                  renderBullet: _renderBullet,
                },
          on: {
            click: (swiper) => {
              swiper.autoplay.stop();
            },
            afterInit: (swiper) => {
              const id = "veewoo-swiper-" + new Date().getTime();
              swiper.el.id = id;
              carousels[id] = { swiper, videos: [] };

              _handleVideos(carousel, id);

              if (!isMultipleSlides) return;

              _handlePaginationClick(carousel, swiper);
            },
            slideChangeTransitionStart: (swiper) => {
              _updateTransitionDuration(swiper);
            },
            slideChangeTransitionEnd: (swiper) => {
              _pauseVideos(swiper);
            },
          },
        });
      }
    }

    function _renderBullet(_, className) {
      return (
        '<button class="' +
        className +
        '" aria-label="navigation"><div><span></span><div></button>'
      );
    }

    // Stop the autoplay mode when user click to the pagination items
    function _handlePaginationClick(carousel, swiper) {
      let bullets = carousel.querySelectorAll(".veewoo-o-carousel__bullet");
      for (let bullet of bullets) {
        bullet.addEventListener("click", () => swiper.autoplay.stop());
      }
    }

    // Reset the video id to prevent the id duplication error
    function _handleVideos(carousel, id) {
      let videoContainers = carousel.querySelectorAll(".veewoo-a-wistia-video");
      for (let i = 0; i < videoContainers.length; i++) {
        let videoId = videoContainers[i].dataset.id || "";
        let video = videoContainers[i].querySelector(".wistia_embed");
        video.id = "wistia-" + videoId + "-carousel-" + i;
        carousels[id].videos.push({ id: video.id, handle: null });
      }
    }

    // Pause the videos when the current slide is changed
    function _pauseVideos(swiper) {
      carousels[swiper.el.id]?.videos.forEach((item) => {
        let video = _getVideoHandle(item);
        if (video && video.state() === "playing") {
          video.pause();
        }
      });
    }

    function _getVideoHandle(video) {
      if (!video || !video.id) return null;
      if (video.handle) return video.handle;
      video.handle = Wistia.api(video.id);
      return video.handle;
    }

    function _updateTransitionDuration(swiper) {
      let currentSlide = swiper.slides[swiper.activeIndex];
      if (!currentSlide) return;
      let timeout = parseInt(currentSlide.dataset.swiperAutoplay) || 2000;
      timeout += 500;
      swiper.pagination.bullets.forEach((item, index) => {
        item.querySelector("span").style.transitionDuration =
          index === swiper.realIndex ? timeout + "ms" : null;
      });
    }

    return carousels;
  })();
