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
  threshold = 200,
  throttleMs = 400,
}: ReactQueryInfiniteScrollOptions) {
  // throttle을 사용하여 이벤트 과다 호출 방지
  return throttle(() => {
     // 스크롤이 페이지 하단에 가까워졌을 때만 fetchNextPage 실행
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold
    ) {
      void fetchNextPage();
    }
  }, throttleMs);
}