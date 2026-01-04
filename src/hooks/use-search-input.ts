import { useDeferredValue, useState } from "react";

export function useSearchInput(initialValue?: string) {
  const [query, setQuery] = useState(initialValue ?? "");
  const deferredQuery = useDeferredValue(query);

  return { query, setQuery, deferredQuery };
}
