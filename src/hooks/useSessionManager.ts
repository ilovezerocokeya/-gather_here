import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { throttle } from "lodash";

export const useSessionManager = (resetAuthUser: () => Promise<void>, rememberMe: boolean) => {
  const router = useRouter();
  
  // 마지막 활동 시간 저장
  const lastActivityTimeRef = useRef<number>(Date.now());
  // 자동 로그아웃 타이머 참조
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 비활성 탭 체크 타이머 참조
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // 활동 시작 시간 저장
  const startTimeRef = useRef<number>(Date.now());
  // 스로틀링 간격
  const throttleDelayRef = useRef<number>(10 * 60 * 1000);

  // 자동 로그인 사용자는 활동 감지를 하지 않음
  useEffect(() => {
    if (rememberMe) {
      console.log("자동 로그인 활성화됨: 세션 유지 중...");
      
      const interval = setInterval(async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("세션 갱신 실패:", error);
          await resetAuthUser(); // 세션 만료 시 자동 로그아웃
        } else {
          console.log("세션이 정상 유지됨.");
        }
      }, 55 * 60 * 1000); // 55분마다 세션 갱신 시도

      return () => clearInterval(interval);
    }
  }, [rememberMe, resetAuthUser]);

  // 활동 시마다 1시간 타이머가 새로 설정됨, 1시간 동안 추가 활동이 없으면 로그아웃
  const resetSessionTimer = () => {
    console.log("사용자 활동 감지됨: 세션 연장");
    lastActivityTimeRef.current = Date.now(); // 최근 활동 시간 업데이트

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    sessionTimeoutRef.current = setTimeout(async () => {
      const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;

      if (timeSinceLastActivity >= 60 * 60 * 1000) {
        console.log("1시간 동안 활동 없음: 자동 로그아웃");

        await resetAuthUser();

        // 로그아웃 후 세션 만료 여부를 최종 확인 후 페이지 이동
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/");
        }
      }
    }, 60 * 60 * 1000); // 1시간 후 로그아웃
  };

  // 자동 로그인 사용자는 이벤트 감지 비활성화
  useEffect(() => {
    if (rememberMe) {
      console.log("자동 로그인 사용 중: 사용자 활동 감지 비활성화");
      return;
    }

    const updateThrottleDelay = () => {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed > 60 * 60 * 1000) {
        console.log("1시간 연속 활동 감지됨, 감지 중단");
        return null;
      } else if (elapsed > 30 * 60 * 1000) {
        return 60 * 60 * 1000; // 1시간
      } else if (elapsed > 10 * 60 * 1000) {
        return 30 * 60 * 1000; // 30분
      } else {
        return 10 * 60 * 1000; // 10분
      }
    };

    let currentThrottleDelay = updateThrottleDelay();
    if (!currentThrottleDelay) return;

    const activityHandler = throttle(() => {
      resetSessionTimer();

      // 현재 활동 시간 기반으로 스로틀링 시간 동적 변경
      let newDelay = updateThrottleDelay();
      if (newDelay && newDelay !== throttleDelayRef.current) {
        throttleDelayRef.current = newDelay;
      }
    }, currentThrottleDelay); // 동적 스로틀링 적용

    const events = ["mousemove", "keydown", "mousedown", "wheel"];

    events.forEach((event) => document.addEventListener(event, activityHandler));

    return () => {
      events.forEach((event) => document.removeEventListener(event, activityHandler));
      activityHandler.cancel();
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    };
  }, [resetAuthUser, rememberMe]);

  // 사용자가 탭을 나간 상태에서 1시간이 지나면 자동 로그아웃
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("탭이 비활성화됨: 1시간 후 로그아웃 감지 시작");

        activityCheckIntervalRef.current = setInterval(async () => {
          const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;

          if (timeSinceLastActivity >= 60 * 60 * 1000) {
            console.log("1시간 동안 활동 없음 (비활성 탭 포함): 자동 로그아웃");

            await resetAuthUser();

            // 로그아웃 후 세션 만료 여부를 최종 확인 후 페이지 이동
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
              router.push("/");
            }
          }
        }, 60 * 1000); // 1분마다 체크
      } else {
        if (activityCheckIntervalRef.current) {
          clearInterval(activityCheckIntervalRef.current);
          activityCheckIntervalRef.current = null;
          console.log("탭이 다시 활성화됨: 자동 로그아웃 감지 중지");
        }
      }
    };

    // `visibilitychange` 이벤트 리스너 추가
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 타이머 정리
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (activityCheckIntervalRef.current) clearInterval(activityCheckIntervalRef.current);
    };
  }, [resetAuthUser, router]);

  return {};
};
