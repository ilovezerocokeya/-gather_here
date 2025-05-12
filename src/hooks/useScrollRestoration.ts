"use client";

import { useEffect, useLayoutEffect } from "react";

// 페이지 스크롤 위치를 세션에 저장하고, 조건부로 복원하는 커스텀 훅
export function useScrollRestoration(storageKey: string, canRestore: boolean) {
  
  // 초기 설정: 브라우저 기본 스크롤 복원 비활성화
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 페이지 진입 시 저장된 위치로 스크롤 복원
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !canRestore) return;

    const savedY = sessionStorage.getItem(storageKey);
    if (savedY === null) return;

    const targetY = Number(savedY);
    let attempt = 0;
    const maxAttempts = 30;
    const interval = 100;
    const errorRange = 20;

    const restoreInterval = setInterval(() => {
      attempt++;

      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // 렌더링 완료된 높이가 복원 위치보다 충분할 때까지 대기
      if (scrollHeight - windowHeight >= targetY || attempt >= maxAttempts) {
        const distance = Math.abs(window.scrollY - targetY);

        // 현재 위치와 목표 위치 차이가 클 경우 복원 시도
        if (distance > errorRange) {
          window.scrollTo(0, targetY);
        }

        clearInterval(restoreInterval); // 성공이든 실패든 반복 중지
      }
    }, interval);

    return () => clearInterval(restoreInterval);
  }, [storageKey, canRestore]);

  // 스크롤 이벤트 발생 시 현재 위치를 세션에 저장
  useEffect(() => {
    if (typeof window === "undefined") return;

    let throttleTimer: NodeJS.Timeout | null = null;

    const saveScroll = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        sessionStorage.setItem(storageKey, String(window.scrollY));
        throttleTimer = null;
      }, 500);
    };

    window.addEventListener("scroll", saveScroll);

    return () => {
      window.removeEventListener("scroll", saveScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [storageKey]);
}