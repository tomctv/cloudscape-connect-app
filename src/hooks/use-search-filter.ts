import { useMemo } from "react";
import { useSearchInput } from "./use-search-input";

type SearchableKeys<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export function useSearchFilter<T>(
  items: T[],
  searchableKeys: SearchableKeys<T>[],
  options?: {
    initialQuery?: string;
    caseSensitive?: boolean;
    matchFn?: (itemValue: string, query: string) => boolean;
  }
) {
  const { query, setQuery, deferredQuery } = useSearchInput(
    options?.initialQuery
  );

  const filteredItems = useMemo(() => {
    if (!deferredQuery.trim()) return items;

    const searchQuery = options?.caseSensitive
      ? deferredQuery
      : deferredQuery.toLowerCase();

    const defaultMatch = (value: string, q: string) => value.includes(q);
    const matchFn = options?.matchFn || defaultMatch;

    return items.filter((item) => {
      return searchableKeys.some((key) => {
        let value = String(item[key]);
        if (!options?.caseSensitive) {
          value = value.toLowerCase();
        }
        return matchFn(value, searchQuery);
      });
    });
  }, [items, searchableKeys, deferredQuery, options]);

  return { query, setQuery, filteredItems };
}
