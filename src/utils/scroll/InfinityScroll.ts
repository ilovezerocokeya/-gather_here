import { throttle } from "lodash";

interface ReactQueryInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | void;
  threshold?: number;
  throttleMs?: number;
}

export function ReactQueryInfiniteScrollHandler({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 600,
  throttleMs = 400,
}: ReactQueryInfiniteScrollOptions) {
  return throttle(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold
    ) {
      void fetchNextPage();
    }
  }, throttleMs);
}