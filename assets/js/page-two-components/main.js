window.veewooJs = window.veewooJs || {
  isMobile: function () {
    return !this.isTablet();
  },
  isTablet: function () {
    return window.matchMedia("(min-width:48rem)").matches;
  },
  isDesktop: function () {
    return window.matchMedia("(min-width:64rem)").matches;
  },
  isTabletOnly: function () {
    return this.isTablet() && !this.isDesktop();
  },
  setGlobalSizes: function () {
    const bodyStyle = document.body.style;

    const clientWidth = document.body.clientWidth;
    bodyStyle.setProperty("--page-width", clientWidth + "px");

    const containerWidth = Math.min(
      1600,
      clientWidth - (this.isMobile() ? 40 : 120)
    );
    bodyStyle.setProperty("--container-width", containerWidth + "px");
  },
};

window.veewooEventHandlers =
  window.veewooEventHandlers ||
  (function () {
    let eventHandlers = [];

    window.addEventListener("load", () => setTimeout(_execute, 0));

    function _execute() {
      eventHandlers = eventHandlers.sort((a, b) =>
        a.order < b.order ? -1 : 1
      );
      eventHandlers.forEach((item) => item.callback());
    }

    function add(key, callback, order) {
      if (!eventHandlers.some((item) => item.key === key)) {
        eventHandlers.push({ key, callback, order });
      }
    }

    return {
      add,
    };
  })();
