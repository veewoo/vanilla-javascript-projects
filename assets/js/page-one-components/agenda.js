document.addEventListener("DOMContentLoaded", () => {
    let swiper
    let swiper2
    initSwiper()

    window.addEventListener("resize", () => {
        initSwiper()
    })

    function initSwiper() {
        try {
            swiper?.destroy()
            swiper2?.destroy()

            swiper = new Swiper(".agenda-tab__header", {
                spaceBetween: 10,
                slidesPerView: 3,
                watchSlidesProgress: true,
                breakpoints: {
                    768: {
                        allowTouchMove: false,
                        slidesPerView: "auto",
                    },
                },
            })

            swiper2 = new Swiper(".agenda-tab__content", {
                spaceBetween: 10,
                thumbs: { swiper },
            })
        } catch (error) {
            console.log({ error })
        }
    }
})
