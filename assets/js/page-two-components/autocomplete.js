(function () {
  window.addEventListener("load", _init);

  function _init() {
    const elements = [...document.querySelectorAll(".veewoo-a-autocomplete")];

    elements.forEach((element, index) => {
      const apiUrl = element.dataset.apiUrl;
      const redirectUrl = element.dataset.redirectUrl;
      const resultsListDestination = element.getAttribute("data-results-list-destination") || "";
      const id = "veewooAutocomplete-" + index;

      element.id = id;

      const autoCompleteJS = new window.autoComplete({
        wrapper: false,
        debounce: 800,
        selector: "#" + id,
        wrapper: element.getAttribute("data-is-no-wrapper") !== "true",
        data: {
          src: apiUrl ? (v) => _getSourceData(v, apiUrl) : [],
        },
        resultsList: {
          maxResults: 9999,
          noResults: true,
          class: "veewoo-a-autocomplete__result-list",
          destination: resultsListDestination,
          position: !!resultsListDestination ? "beforeend" : "afterend",
        },
        searchEngine: (_, record) => record,
        events: {
          input: {
            init(event) {
              const wrapper = event.target.closest(".autoComplete_wrapper");
              if (wrapper) {
                wrapper.querySelector(".veewoo-a-autocomplete__result-list")?.setAttribute("aria-label", "Result List");
              }

              const urlParams = new URLSearchParams(window.location.search);
              if (!urlParams.has("query")) return;
              event.target.value = urlParams.get("query");
            },
            selection(event) {
              const feedback = event.detail;
              if (!feedback || !feedback.selection) return;
              // Replace Input value with the selected value
              autoCompleteJS.input.value = event.target.value;
              autoCompleteJS.input.blur();
              _redirect(feedback.selection.value, redirectUrl);
            },
            keyup(event) {
              if (event.key !== "Enter") return;
              _redirect(event.target.value, redirectUrl);
            },
          },
        },
      });

      autoCompleteJS.input.addEventListener("input", function (event) {
        if (!event.target.value) autoCompleteJS.list.innerHTML = "";
      });
    });
  }

  function _getSourceData(value, apiUrl) {
    if (!value) return [];
    return axios.get(apiUrl + value).then((res) => res.data);
  }

  function _redirect(value, redirectUrl) {
    if (!value) return;
    let url = window.location.origin;
    url += redirectUrl ? redirectUrl : window.location.pathname;
    url += "?query=" + encodeURIComponent(value);
    window.location.href = url;
  }
})();
