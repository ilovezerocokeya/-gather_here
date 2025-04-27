"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PuzzleAnimation from "./PuzzleAnimation";

interface InitialLoadingWrapperProps {
  children: React.ReactNode;
  targetPath?: string;
  delay?: number; 
}

const InitialLoadingWrapper: React.FC<InitialLoadingWrapperProps> = ({
  children,
  targetPath = "/all",
  delay = 500,          
}) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const pathname = usePathname(); 

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (pathname === targetPath) {
      // 현재 경로가 targetPath와 일치하면 로딩 애니메이션 표시
      timeoutId = setTimeout(() => {
        setInitialLoading(false); // delay 이후 로딩 종료
      }, delay);
    } else {
      
      setInitialLoading(false); // 다른 경로에서는 바로 로딩 종료
    }
    return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 정리
  }, [pathname, targetPath, delay]);

  if (initialLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <PuzzleAnimation />
      </div>
    );
  }

  return <>{children}</>;
};

export default InitialLoadingWrapper;