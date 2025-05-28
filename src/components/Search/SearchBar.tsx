"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import useSearch from "@/hooks/useSearch";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const { searchWord, setSearchWord, handleSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  // 돋보기 클릭 → 열기/닫기 전용
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOpen) {
      setIsOpen(false);
      setSearchWord("");
    } else {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Enter 키는 검색만 수행
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSearch(e); // 검색 로직은 useSearch 내부에서 처리
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchWord("");
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setSearchWord]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchWord("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setSearchWord]);

  return (
    <form
      ref={containerRef}
      onSubmit={onSubmit}
      className="relative flex items-center"
    >
      {/* 검색 입력창 */}
      <input
        ref={inputRef}
        type="text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        placeholder="찾고 있는 구인모집 키워드가 있나요?"
        className={`
          transition-all duration-300 ease-in-out
          absolute right-10 text-white placeholder:text-gray-400
          border-b-2 border-white focus:border-green-400 
          bg-transparent outline-none
          text-base tracking-wide font-light
          h-[28px]
          ${isOpen ? "w-[280px] opacity-100" : "w-0 opacity-0 pointer-events-none"}
        `}
      />

      {/* 돋보기 버튼 (열기 / 닫기만 담당) */}
      <button
        type="button"
        aria-label="검색 열기/닫기"
        onClick={handleToggle}
        className="ml-2 text-white hover:text-green-400 p-2 transition-colors"
      >
        <FiSearch size={22} />
      </button>
    </form>
  );
};

export default SearchBar;