"use client";

import { useEffect, useLayoutEffect } from "react";

export function useScrollRestoration(storageKey: string, canRestore: boolean) {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !canRestore) return;

    const savedY = sessionStorage.getItem(storageKey);
    if (savedY === null) return;

    const targetY = Number(savedY);
    let attempt = 0;
    const maxAttempts = 30;
    const interval = 50; // 50ms마다 체크
    const errorRange = 20;

    const restoreInterval = setInterval(() => {
      attempt++;

      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // 복원 가능한 높이까지 렌더링이 되었는지 체크
      if (scrollHeight - windowHeight >= targetY || attempt >= maxAttempts) {
        const distance = Math.abs(window.scrollY - targetY);

        if (distance > errorRange) {
          window.scrollTo(0, targetY); // 스크롤 복원 시도
        }

        clearInterval(restoreInterval); // 복원이든 실패든 무조건 종료
        
      }
    }, interval);

    return () => clearInterval(restoreInterval);
  }, [storageKey, canRestore]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let throttleTimer: NodeJS.Timeout | null = null;

    const saveScroll = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        sessionStorage.setItem(storageKey, String(window.scrollY));
        throttleTimer = null;
      }, 300);
    };

    window.addEventListener("scroll", saveScroll);

    return () => {
      window.removeEventListener("scroll", saveScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [storageKey]);
}