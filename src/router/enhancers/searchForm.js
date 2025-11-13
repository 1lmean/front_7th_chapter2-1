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

const handleCategoryClick = (event) => {
  // 브레드크럼 버튼이면 무시
  if (event.target.closest("button[data-breadcrumb]")) {
    return;
  }

  const button = event.target.closest("button[data-category1], button[data-category2]");
  if (!button) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const params = new URLSearchParams(window.location.search);
  const category1 = button.dataset.category1 || "";
  const category2 = button.dataset.category2 || "";

  if (category2) {
    // 2차 카테고리 선택
    params.set("category1", category1);
    params.set("category2", category2);
  } else if (category1) {
    // 1차 카테고리 선택
    params.set("category1", category1);
    params.delete("category2");
  }

  params.delete("page");
  eventBus.emit("filters:change", params);
};

const handleBreadcrumbClick = (event) => {
  const button = event.target.closest("button[data-breadcrumb]");
  if (!button) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const params = new URLSearchParams(window.location.search);
  const breadcrumbType = button.dataset.breadcrumb;

  if (breadcrumbType === "reset") {
    // 전체 클릭 - 모든 카테고리 제거 (검색어와 다른 필터는 유지)
    params.delete("category1");
    params.delete("category2");
  } else if (breadcrumbType === "category1") {
    // 1차 카테고리 브레드크럼 클릭 - 2차 카테고리만 제거 (1차 카테고리와 다른 필터는 유지)
    params.delete("category2");
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
  // 브레드크럼 클릭 이벤트를 먼저 등록하여 우선 처리
  searchForm.addEventListener("click", handleBreadcrumbClick, true); // capture phase에서 처리
  searchForm.addEventListener("click", handleCategoryClick);

  if (searchInput) {
    searchInput.addEventListener("keydown", handleSearchInputKeydown);
  }

  return () => {
    searchForm.removeEventListener("change", handleFormChange);
    searchForm.removeEventListener("click", handleCategoryClick);
    searchForm.removeEventListener("click", handleBreadcrumbClick, true); // capture phase 리스너 제거
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
