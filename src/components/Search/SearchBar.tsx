"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState, FormEvent } from "react";
import { createPortal } from "react-dom";
import useSearch from "@/hooks/useSearch";
import { SearchModalRef } from "@/types/refs/SearchModal";

const SearchModal = forwardRef<SearchModalRef>((props, ref) => {
  const { searchWord, setSearchWord, handleSearch } = useSearch();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 외부에서 접근 가능한 메서드 노출
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  // 외부 클릭 감지 효과
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
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

  // 검색 폼 제출 핸들러
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSearch(e);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 ease-in-out backdrop-blur-sm z-10">
      <div
        ref={modalRef}
        className="mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s w-full h-[58px] p-5 bg-primary rounded-[20px] flex-col justify-start items-start inline-flex mt-[60px] md:mt-[80px] absolute inset-x-0 inset-y-32 z-99"
      >
        <div className="self-stretch justify-start items-center gap-5 inline-flex">
          <div data-svg-wrapper>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8083 1.35849C8.30209 1.35849 5.89848 2.3541 4.12629 4.12629C2.3541 5.89848 1.35849 8.30209 1.35849 10.8083C1.35849 13.3146 2.3541 15.7182 4.12629 17.4904C5.89848 19.2626 8.30208 20.2582 10.8083 20.2582C13.3068 20.2582 15.7032 19.2688 17.4738 17.5069C17.4807 17.4994 17.4878 17.492 17.4951 17.4847C17.5019 17.4779 17.5088 17.4713 17.5158 17.4649C19.2721 15.6952 20.2582 13.3026 20.2582 10.8083C20.2582 8.30208 19.2626 5.89848 17.4904 4.12629C15.7182 2.3541 13.3146 1.35849 10.8083 1.35849ZM18.9203 17.951C20.6529 15.9834 21.6167 13.4456 21.6167 10.8083C21.6167 7.94179 20.478 5.19265 18.451 3.16569C16.424 1.13873 13.6749 0 10.8083 0C7.94179 0 5.19265 1.13873 3.16569 3.16569C1.13873 5.19265 0 7.94179 0 10.8083C0 13.6749 1.13873 16.424 3.16569 18.451C5.19265 20.478 7.94179 21.6167 10.8083 21.6167C13.4497 21.6167 15.9914 20.6498 17.9602 18.9121L22.84 23.8006C23.1051 24.0661 23.5351 24.0665 23.8006 23.8015C24.0661 23.5365 24.0665 23.1064 23.8015 22.8409L18.9203 17.951Z"
                fill="#C4C4C4"
              />
            </svg>
          </div>
          <div className="grow shrink basis-0 h-[20px] flex items-center">
            <form className="relative w-full" onSubmit={onSubmit}>
              <label htmlFor="input" className="sr-only">검색창</label>

              <input
                type="text"
                id="input"
                name="search"
                placeholder="검색어를 입력해보세요"
                className="w-full h-full pr-10 bg-primary text-black text-[20px] md:text-[28px] placeholder:text-[16px] md:placeholder:text-[28px] font-normal font-['Pretendard'] leading-[30px] md:leading-[37.8px] focus:outline-none rounded-md"
                value={searchWord}
                onChange={(evt) => setSearchWord(evt.target.value)}
              />

              {searchWord && (
                <button
                  onClick={() => setSearchWord("")}
                  type="button"
                  aria-label="검색어 지우기"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"
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
        </div>
      </div>
    </div>,
    document.body,
  );
});

SearchModal.displayName = "SearchModal";

export default SearchModal;
