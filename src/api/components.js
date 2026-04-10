import { api } from "./client.js";

/**
 * Build a query string from a params object, skipping empty values.
 */
const toQueryString = (params = {}) => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!filtered.length) return "";
  return "?" + new URLSearchParams(Object.fromEntries(filtered)).toString();
};

/**
 * Fetch paginated components with optional filters.
 * @param {Object} params - { category, search, minPrice, maxPrice, brand, page, limit, sort }
 */
export const fetchComponents = (params = {}) => {
  return api.get(`/api/components${toQueryString(params)}`);
};

/**
 * Fetch a single component by ID.
 */
export const fetchComponentById = (id) => {
  return api.get(`/api/components/${id}`);
};

/**
 * Fetch all categories with component counts.
 */
export const fetchCategories = () => {
  return api.get("/api/components/categories");
};

/**
 * Fetch distinct brands, optionally filtered by category.
 */
export const fetchBrands = (category) => {
  return api.get(`/api/components/brands${category ? `?category=${category}` : ""}`);
};
