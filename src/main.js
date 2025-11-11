import { createRouter } from "./router/Router.js";
import { Homepage } from "./pages/Homepage.js";
import { DetailPage } from "./pages/DetailPage.js";
import { getProducts, getProduct } from "./api/productApi.js";
import { eventBus } from "./utils/EventBus.js";
import { attachSearchFormEnhancer } from "./router/enhancers/searchForm.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));

// 1) 라우트 정의
const routes = [
  {
    path: "/",
    element: async ({ query }) => {
      const root = document.querySelector("#root");
      root.innerHTML = Homepage({ loading: true, filters: query });

      const data = await getProducts(query);
      const mergedFilters = {
        ...query,
        ...(data?.filters ?? {}),
      };

      return Homepage({
        loading: false,
        filters: mergedFilters,
        products: data?.products ?? [],
        pagination: data?.pagination,
      });
    },
  },
  {
    path: "/products/:id",
    element: async ({ params }) => {
      const root = document.querySelector("#root");
      root.innerHTML = DetailPage({ loading: true });

      const product = await getProduct(params.id);
      return DetailPage({ loading: false, ...product });
    },
  },
];

// 2) 라우터 생성
const router = createRouter({
  routes,
  rootSelector: "#root",
});

eventBus.on("filters:change", (params) => {
  const search = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params).toString();
  const url = search ? `/?${search}` : "/";
  router.push(url);
});

attachSearchFormEnhancer(router);

// 3) 카드 클릭 시 SPA 네비게이션
const handleCardClick = (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;

  const productId = card.dataset.productId;
  if (!productId) return;

  router.push(`/products/${productId}`);
};

document.body.addEventListener("click", handleCardClick);

// 4) 애플리케이션 시작
const startApp = () => {
  router.start();
};

if (import.meta.env.MODE !== "test") {
  enableMocking().then(startApp);
} else {
  startApp();
}
