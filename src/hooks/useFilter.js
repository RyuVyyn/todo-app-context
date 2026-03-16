// src/hooks/useFilter.js
import { useState, useCallback } from "react";
export const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};
export const useFilter = (initialFilter = FILTERS.ALL) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const setFilter = useCallback((filter) => {
    if (Object.values(FILTERS).includes(filter)) {
      setActiveFilter(filter);
    }
  }, []);
  return { activeFilter, setFilter, FILTERS };
};
