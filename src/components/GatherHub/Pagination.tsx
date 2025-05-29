"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const searchParams = useSearchParams();

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    const delta = 2; // 현재 페이지 중심 ±2
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const generateLink = (page: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const renderPageButton = (page: number, label?: string) => (
    <Link
      key={label ?? page}
      href={generateLink(page)}
      scroll={false}
      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
        currentPage === page
          ? "border-primary text-primary font-semibold bg-[#1e1e1e]"
          : "border-gray-600 text-gray-400 hover:border-white hover:text-white"
      }`}
    >
      {label ?? page}
    </Link>
  );

  return (
    <div className="w-full flex justify-center mt-12 pb-20">
      <div className="flex items-center gap-2">
        {/* 이전 버튼 */}
        {currentPage > 1 && renderPageButton(currentPage - 1, "‹")}

        {/* 페이지 번호 */}
        {getPageNumbers().map((page, idx) =>
          typeof page === "number"
            ? renderPageButton(page)
            : <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500 text-sm">…</span>
        )}

        {/* 다음 버튼 */}
        {currentPage < totalPages && renderPageButton(currentPage + 1, "›")}
      </div>
    </div>
  );
};

export default Pagination;