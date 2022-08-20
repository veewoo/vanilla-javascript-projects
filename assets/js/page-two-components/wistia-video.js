(function () {

  window.veewooEventHandlers?.add('wistiaVideoModule', _init, 2);

  function _init() {

    window._wq = window._wq || [];
    _wq.push({
      id: "_all",
      onHasData: function (video) {

        let swiperContainer = video.container.closest('.swiper');
        swiperContainer && window.veewooJs.isDesktop() && video.height(421, { constrain: true });

        video.bind("play", () => _handleInterruption("play", swiperContainer));
        video.bind("pause", () => _handleInterruption("pause", swiperContainer));

      }
    });

  }

  function _handleInterruption(type, swiperContainer) {
    const isPlay = type === "play";
    swiperContainer && (swiperContainer.swiper.allowTouchMove = !isPlay);
  }

})();
