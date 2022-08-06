document.addEventListener("DOMContentLoaded", () => {
  const cardMap = new Map();

  initSwiper();

  window.addEventListener("resize", () => initSwiper());

  function initSwiper() {
    for (const cardList of document.querySelectorAll(".card-list-container")) {
      const classes = [...cardList.querySelector(".card-list").classList];
      const isGrid =
        classes.includes("card-list--d-grid-3-md") ||
        classes.includes("card-list--d-grid-4-md");
      const hasMultipleCards = classes.includes(
        "card-list--multiple-card-slider"
      );
      const isPaginationCustom = classes.includes(
        "card-list--pagination-custom"
      );
      const isDesktopNoSlider = classes.includes("desktop-noslider");

      if (cardMap.has(cardList)) {
        cardMap.get(cardList).destroy(true, true);
      }

      if (!isDesktopNoSlider) {
        const swiper = new Swiper(cardList, {
          slidesPerView: hasMultipleCards ? 1 : "auto",
          spaceBetween: 30,
          pagination: getPaginationConfig(cardList),
          breakpoints: {
            767: isGrid
              ? {
                  enabled: false,
                  pagination: false,
                  spaceBetween: 40,
                }
              : {
                  pagination: false,
                  spaceBetween: 40,
                },
            1025:
              hasMultipleCards || isPaginationCustom
                ? {
                    pagination: getPaginationConfig(
                      cardList,
                      isPaginationCustom
                    ),
                    spaceBetween: 40,
                  }
                : {
                    enabled: false,
                    pagination: false,
                  },
          },
        });

        cardMap.set(cardList, swiper);
      } else if (window.innerWidth >= 320 && window.innerWidth <= 1025) {
        const swiper = new Swiper(cardList, {
          slidesPerView: !hasMultipleCards ? "auto" : 1,
          spaceBetween: 30,
          pagination: getPaginationConfig(cardList),
        });

        cardMap.set(cardList, swiper);
      }
    }
  }

  function getPaginationConfig(swiper, isCustom = false) {
    const paginationWrapper = swiper.querySelector(".swiper-pagination");
    if (!paginationWrapper) {
      return {
        enabled: false,
      };
    }

    const type = !isCustom
      ? { type: "bullets" }
      : {
          type: "custom",
          renderCustom,
        };

    if (isCustom) {
      paginationWrapper.removeEventListener(
        "click",
        handlePaginationCustomClick
      );
      paginationWrapper.addEventListener("click", handlePaginationCustomClick);
    }

    return {
      el: swiper.querySelector(".swiper-pagination"),
      clickable: true,
      enabled: true,
      ...type,
    };
  }

  function renderCustom(swiper, currentIndex, total) {
    const firstIndex = 0;
    const lastIndex = total - 1;
    const activeIndex = lastIndex <= currentIndex ? lastIndex : firstIndex;

    return [firstIndex, lastIndex].reduce(
      (previousValue, currentValue) =>
        previousValue +
        `<button 
					class="
                        swiper-pagination-custom 
                        ${
                          currentValue === activeIndex
                            ? "swiper-pagination-bullet-active"
                            : ""
                        }" 
					data-index=${currentValue}>
				 </button>`,
      ""
    );
  }

  function handlePaginationCustomClick(e) {
    cardMap
      .get(e.currentTarget.closest(".swiper"))
      ?.slideTo(e.target.dataset.index);
  }
});
