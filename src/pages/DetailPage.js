import { PageLayout } from "./PageLayout";
import { ProductDetail } from "../components/index.js";

export const DetailPage = ({ loading, ...product }) => {
  return PageLayout(ProductDetail({ loading, ...product }));
};
