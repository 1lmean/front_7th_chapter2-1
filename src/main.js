import { Homepage } from "./pages/Homepage.js";
import { getProduct, getProducts } from "./api/productApi.js";
import { DetailPage } from "./pages/DetailPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// const push = ({ path }) => {
//   history.pushState(null, null, path);
//   render();
// };

async function render() {
  const $root = document.querySelector("#root");
  if (location.pathname === "/") {
    $root.innerHTML = Homepage({ loading: true });

    const data = await getProducts();
    $root.innerHTML = Homepage({ loading: false, ...data });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".product-card")) {
        const productId = e.target.closest(".product-card").dataset.productId;
        history.pushState(null, null, `/products/${productId}`);
        // router.push(`/products/${productId}`);

        render();
      }
    });
  } else {
    const productId = location.pathname.split("/").pop();
    const data = await getProduct(productId);
    $root.innerHTML = DetailPage({ loading: false, ...data });
  }

  window.addEventListener("popstate", () => {
    render();
  });
  // router.onpopstate = render
}

function main() {
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
