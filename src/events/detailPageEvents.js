import { appendCartProduct } from "../store/appStore.js";

const handleDetailPageClick = (event) => {
  // DetailPage 장바구니 담기 버튼
  const addToCartButton = event.target.closest("#add-to-cart-btn");
  if (addToCartButton) {
    const productId = addToCartButton.dataset.productId;
    if (!productId) {
      return;
    }

    // 상품 상세 정보에서 데이터 추출
    const productImage = document.querySelector(".product-detail-image");
    const productTitle = document.querySelector("h1");
    const productPrice = document.querySelector(".text-2xl.font-bold.text-blue-600");
    const quantityInput = document.querySelector("#quantity-input");

    const title = productTitle?.textContent?.trim() ?? "";
    const priceText = productPrice?.textContent ?? "";
    const price = Number(priceText.replace(/[^\d]/g, "")) || 0;
    const image = productImage?.getAttribute("src") ?? "";
    const quantity = Number(quantityInput?.value ?? 1);

    // 수량만큼 장바구니에 추가
    for (let i = 0; i < quantity; i++) {
      appendCartProduct({
        id: productId,
        title,
        price,
        image,
      });
    }

    // DetailPage에서는 모달을 띄우지 않음
    return;
  }
};

export const registerDetailPageEvents = () => {
  document.body.addEventListener("click", handleDetailPageClick);
};
