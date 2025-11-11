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

const bindSearchFormListeners = () => {
  const root = document.querySelector("#root");
  if (!root) {
    return () => {};
  }

  const searchForm = root.querySelector("[data-search-form]");
  if (!searchForm) {
    return () => {};
  }

  searchForm.addEventListener("change", handleFormChange);

  return () => {
    searchForm.removeEventListener("change", handleFormChange);
  };
};

export const attachSearchFormEnhancer = (router) => {
  let cleanup = () => {};

  router.subscribe(() => {
    cleanup();
    cleanup = bindSearchFormListeners();
  });
};
