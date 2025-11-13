const renderCategory1Buttons = (categories = {}, selectedCategory1 = "") => {
  const category1Names = Object.keys(categories);
  if (category1Names.length === 0) {
    return '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>';
  }

  return category1Names
    .map((cat1) => {
      const isSelected = cat1 === selectedCategory1;
      return `<button 
        data-category1="${cat1}" 
        class="text-left px-3 py-2 text-sm rounded-md border transition-colors ${
          isSelected
            ? "bg-blue-100 border-blue-300 text-blue-800"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }">${cat1}</button>`;
    })
    .join("");
};

const renderCategory2Buttons = (categories = {}, selectedCategory1 = "", selectedCategory2 = "") => {
  if (!selectedCategory1 || !categories[selectedCategory1]) {
    return "";
  }

  const category2Names = Object.keys(categories[selectedCategory1]);
  if (category2Names.length === 0) {
    return "";
  }

  return `<div class="flex flex-wrap gap-2 mt-2">
    ${category2Names
      .map((cat2) => {
        const isSelected = cat2 === selectedCategory2;
        return `<button 
          data-category1="${selectedCategory1}" 
          data-category2="${cat2}" 
          class="text-left px-3 py-2 text-sm rounded-md border transition-colors ${
            isSelected
              ? "bg-blue-100 border-blue-300 text-blue-800"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }">${cat2}</button>`;
      })
      .join("")}
  </div>`;
};

const renderBreadcrumb = (selectedCategory1 = "", selectedCategory2 = "", allCategory1Names = []) => {
  const breadcrumbParts = ['<label class="text-sm text-gray-600">카테고리:</label>'];

  breadcrumbParts.push(
    '<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>',
  );

  if (selectedCategory1) {
    breadcrumbParts.push('<span class="text-xs text-gray-500">&gt;</span>');
    breadcrumbParts.push(
      `<button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>`,
    );
  }

  if (selectedCategory2) {
    breadcrumbParts.push('<span class="text-xs text-gray-500">&gt;</span>');
    breadcrumbParts.push(`<span class="text-xs text-gray-600 cursor-default">${selectedCategory2}</span>`);
  }

  if (!selectedCategory1 && !selectedCategory2 && allCategory1Names.length > 0) {
    breadcrumbParts.push(`<span class="text-xs text-gray-600">${allCategory1Names.join(" ")}</span>`);
  }

  return breadcrumbParts.join("");
};

export const SearchForm = ({ filters = {}, categories = {} } = {}) => {
  const limit = String(filters.limit ?? "20");
  const sort = String(filters.sort ?? "price_asc");
  const keyword = filters.search ?? filters.query ?? "";
  const selectedCategory1 = filters.category1 ?? "";
  const selectedCategory2 = filters.category2 ?? "";
  const allCategory1Names = Object.keys(categories);

  const contentView = /*html*/ `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4" data-search-form>
            <!-- 검색창 -->
            <div class="mb-4">
            <div class="relative">
                <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${keyword}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                </div>
            </div>
            </div>
            <!-- 필터 옵션 -->
            <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                ${renderBreadcrumb(selectedCategory1, selectedCategory2, allCategory1Names)}
                </div>
                <!-- 1depth 카테고리 -->
                <div class="flex flex-wrap gap-2" data-category1-container>
                ${renderCategory1Buttons(categories, selectedCategory1)}
                </div>
                <!-- 2depth 카테고리 -->
                <div data-category2-container>
                ${renderCategory2Buttons(categories, selectedCategory1, selectedCategory2)}
                </div>
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
                <!-- 페이지당 상품 수 -->
                <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="10" ${limit === "10" ? "selected" : ""}>
                    10개
                    </option>
                    <option value="20" ${limit === "20" ? "selected" : ""}>
                    20개
                    </option>
                    <option value="50" ${limit === "50" ? "selected" : ""}>
                    50개
                    </option>
                    <option value="100" ${limit === "100" ? "selected" : ""}>
                    100개
                    </option>
                </select>
                </div>
                <!-- 정렬 -->
                <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                                focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                    <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                    <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
                    <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
                </select>
                </div>
            </div>
            </div>
        </div> 
    `;
  return contentView;
};
