import { eventBus } from "../../utils/EventBus.js";

const handleFormChange = (event) => {
  const target = event.target;
  if (!target) return;

  const params = new URLSearchParams(window.location.search);

  if (target.matches("#limit-select")) {
    params.set("limit", target.value);
    params.delete("page");
    eventBus.emit("filters:change", params);
    return;
  }

  if (target.matches("#sort-select")) {
    params.set("sort", target.value);
    params.delete("page");
    eventBus.emit("filters:change", params);
  }
};

const handleSearchInputKeydown = (event) => {
  if (event.key !== "Enter") {
    return;
  }

  const searchInput = event.target;
  if (!searchInput || !searchInput.matches("#search-input")) {
    return;
  }

  event.preventDefault();

  const searchValue = searchInput.value.trim();
  const params = new URLSearchParams(window.location.search);

  if (searchValue) {
    params.set("search", searchValue);
  } else {
    params.delete("search");
  }
  params.delete("page");

  eventBus.emit("filters:change", params);
};

const bindSearchFormListeners = () => {
  const root = document.querySelector("#root");
  if (!root) {
    return () => {};
  }

  const searchForm = root.querySelector("[data-search-form]");
  if (!searchForm) {
    return () => {};
  }

  const searchInput = searchForm.querySelector("#search-input");

  searchForm.addEventListener("change", handleFormChange);
  if (searchInput) {
    searchInput.addEventListener("keydown", handleSearchInputKeydown);
  }

  return () => {
    searchForm.removeEventListener("change", handleFormChange);
    if (searchInput) {
      searchInput.removeEventListener("keydown", handleSearchInputKeydown);
    }
  };
};

export const attachSearchFormEnhancer = (router) => {
  let cleanup = () => {};

  router.subscribe(() => {
    cleanup();
    cleanup = bindSearchFormListeners();
  });
};
