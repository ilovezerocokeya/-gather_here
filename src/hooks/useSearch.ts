"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

// 검색어 상태 관리
const useSearch = () => {
  const router = useRouter();
  const [searchWord, setSearchWord] = useState(""); // 검색어 입력 상태

  // 검색 폼 제출 시 실행되는 함수
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = searchWord.trim();
      if (raw.length < 2) return; // 공백 제거 후 2자 미만이면 무시

    router.replace(`/search/${encodeURIComponent(raw)}`); // 검색어를 URL에 포함시켜 검색 페이지로 이동
    setSearchWord(""); // 입력창 초기화
  };

  return {
    searchWord,      
    setSearchWord,   
    handleSearch,  
  };
};

export default useSearch;