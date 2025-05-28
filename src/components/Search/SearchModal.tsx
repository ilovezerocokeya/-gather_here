"use client";

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  FormEvent,
} from "react";
import { createPortal } from "react-dom";
import useSearch from "@/hooks/useSearch";
import { SearchModalRef } from "@/types/refs/SearchModal";

const SearchModal = forwardRef<SearchModalRef>((props, ref) => {
  const { searchWord, setSearchWord, handleSearch } = useSearch();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 외부 제어 핸들러
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  // 바깥 클릭, ESC 감지
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSearch(e); // 빈값 체크 포함되어 있음
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[3px] transition-all duration-200">
      <div
        ref={modalRef}
        className="fixed top-[50%] left-1/2 -translate-x-1/2 w-[90%] max-w-[480px] px-5 py-4 
                 bg-primary rounded-2xl flex items-center justify-start gap-3 z-50 shadow-xl"
      >
        <form className="relative w-full" onSubmit={onSubmit}>
          <label htmlFor="search" className="sr-only">
            검색창
          </label>
          <input
            id="search"
            name="search"
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="키워드로 검색해주세요"
            className="w-full bg-primary text-black placeholder:text-gray-600 text-lg md:text-xl ml-2 mr-16 pr-24 h-12 rounded-md focus:outline-none"
          />
          {searchWord && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchWord("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#5E5E5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
});

SearchModal.displayName = "SearchModal";

export default SearchModal;