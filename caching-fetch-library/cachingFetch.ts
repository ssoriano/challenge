// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge
import { useEffect, useState } from "react";

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */

// Shared in-memory cache
const cache: Map<
  string,
  { data: unknown; error: Error | null; promise: Promise<void> | null }
> = new Map();

export const useCachingFetch: UseCachingFetch = (url) => {
  const [data, setData] = useState<unknown>(cache.get(url)?.data ?? null);
  const [isLoading, setIsLoading] = useState(!!cache.get(url)?.promise);
  const [error, setError] = useState<Error | null>(
    cache.get(url)?.error ?? null,
  );

  useEffect(() => {
    const cached = cache.get(url);

    // Only skip fetch if we already have data and no ongoing request
    if (cached?.data != null && cached.promise == null) {
      console.log("Cache hit, skipping fetch:", cached);
      return;
    }

    console.log("Starting fetch");

    let isMounted = true;
    const controller = new AbortController();

    const entry = {
      data: null,
      error: null,
      promise: null as Promise<void> | null,
    };
    cache.set(url, entry);

    entry.promise = (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, { signal: controller.signal });
        const json = await response.json();
        entry.data = json;
        if (isMounted) {
          setData(json);
        }
      } catch (err: any) {
        entry.error = err;
        if (isMounted) {
          setError(err);
        }
      } finally {
        entry.promise = null;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  return { data, isLoading, error };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  if (cache.has(url)) {
    return;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();
    cache.set(url, { data: json, error: null, promise: null });
  } catch (err: any) {
    cache.set(url, { data: null, error: err, promise: null });
  }
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  const serializableCache: Record<
    string,
    { data: unknown; error: string | null }
  > = {};
  cache.forEach((value, key) => {
    serializableCache[key] = {
      data: value.data,
      error: value.error ? value.error.message : null,
    };
  });
  return JSON.stringify(serializableCache);
};

export const initializeCache = (serializedCache: string): void => {
  try {
    const parsed: Record<string, { data: unknown; error: string | null }> =
      JSON.parse(serializedCache);
    Object.entries(parsed).forEach(([key, value]) => {
      cache.set(key, {
        data: value.data,
        error: value.error ? new Error(value.error) : null,
        promise: null,
      });
    });
  } catch (err) {
    console.error("Failed to initialize cache:", err);
  }
};

export const wipeCache = (): void => {
  cache.clear();
};
