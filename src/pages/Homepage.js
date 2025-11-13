import { PageLayout } from "./PageLayout.js";
import { SearchForm, ProductList, CartModal } from "../components/index.js";

export const Homepage = ({ filters, products, pagination, loading = false, categories = {} }) => {
  const totalCount = pagination?.total ?? 0;
  return PageLayout(`
        ${SearchForm({ filters, pagination, categories })}
        ${ProductList({ loading, products, pagination, totalCount })}
        ${CartModal()}
    `);
};
