import { useState, useEffect, useCallback, useRef } from "react";
import { fetchComponents, fetchCategories } from "../api/components.js";

/**
 * useComponents — fetches components from the real API with filtering + pagination.
 *
 * Usage in ManualBuilderPage:
 *   const { components, pagination, loading, error, setFilters, setPage } = useComponents();
 */
export const useComponents = (initialFilters = {}) => {
  const [filters, setFiltersState] = useState({
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "name_asc",
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const [components, setComponents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search to avoid hammering the API
  const debounceRef = useRef(null);

  const loadComponents = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchComponents(params);
      setComponents(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce when search changes, immediate otherwise
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      loadComponents(filters);
    }, filters.search ? 400 : 0);

    return () => clearTimeout(debounceRef.current);
  }, [filters, loadComponents]);

  const setFilters = useCallback((updates) => {
    setFiltersState((prev) => ({ ...prev, ...updates, page: 1 })); // reset to page 1 on filter change
  }, []);

  const setPage = useCallback((page) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  return { components, pagination, loading, error, filters, setFilters, setPage };
};

/**
 * useCategories — fetches the list of categories with counts.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};
