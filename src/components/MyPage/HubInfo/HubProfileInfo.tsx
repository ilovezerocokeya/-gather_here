"use client";

import React, { useState } from "react";

const HubProfileForm: React.FC<{
  blog: string;
  setBlog: (value: string) => void;
  firstLinkType: string;
  setFirstLinkType: (value: string) => void;
  firstLink: string;
  setFirstLink: (value: string) => void;
  secondLinkType: string;
  setSecondLinkType: (value: string) => void;
  secondLink: string;
  setSecondLink: (value: string) => void;
}> = ({
  blog,
  setBlog,
  firstLinkType,
  setFirstLinkType,
  firstLink,
  setFirstLink,
  secondLinkType,
  setSecondLinkType,
  secondLink,
  setSecondLink,
}) => {
  const [blogError, setBlogError] = useState("");

  const platforms = [
    { value: "behance", label: "비핸스" },
    { value: "github", label: "깃허브" },
    { value: "instagram", label: "인스타그램" },
    { value: "brunch", label: "브런치" },
    { value: "linkedin", label: "링크드인" },
    { value: "notion", label: "노션" },
    { value: "pinterest", label: "핀터레스트" },
    { value: "medium", label: "미디엄" },
    { value: "tistory", label: "티스토리" },
    { value: "facebook", label: "페이스북" },
    { value: "youtube", label: "유튜브" },
  ];

  const validateForm = () => {
    if (!blog) {
      setBlogError("포트폴리오 링크는 필수 항목입니다.");
      return false;
    }
    setBlogError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출을 차단
    if (!validateForm()) {
      return; // 유효성 검사에 실패하면 더 이상 진행하지 않음
    }

    // 저장 로직 (유효성 검사를 통과한 경우에만 실행)
    console.log("폼 제출: 모든 값이 유효합니다.");
    // 저장 함수 호출 또는 처리 로직
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <fieldset className="p-3 s:p-0">
        <div>
          <label htmlFor="blog" className="block text-sm font-medium text-labelNormal mb-1">
            포트폴리오 링크<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="url"
            id="blog"
            name="blog"
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            placeholder="포트폴리오 링크를 입력하세요."
            className={`w-full shared-input-gray-2 border-[1px] ${blogError ? "border-red-500" : "border-fillLight"}`}
          />
          {blogError && <p className="text-red-500 text-sm mt-1">{blogError}</p>}
        </div>

        <div>
          <label htmlFor="firstLinkType" className="block text-sm font-medium text-labelNormal mb-1">
            추가 링크 1
          </label>
          <div className="flex gap-2">
            <select
              id="firstLinkType"
              name="firstLinkType"
              value={firstLinkType}
              onChange={(e) => setFirstLinkType(e.target.value)}
              className="w-1/3 shared-select-gray-2 border-[1px] border-fillLight"
            >
              <option value="">링크 선택</option>
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <input
              type="url"
              id="firstLink"
              name="firstLink"
              value={firstLink}
              onChange={(e) => setFirstLink(e.target.value)}
              placeholder="링크를 입력하세요."
              className="w-2/3 shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>
        </div>

        <div>
          <label htmlFor="secondLinkType" className="block text-sm font-medium text-labelNormal mb-1">
            추가 링크 2
          </label>
          <div className="flex gap-2">
            <select
              id="secondLinkType"
              name="secondLinkType"
              value={secondLinkType}
              onChange={(e) => setSecondLinkType(e.target.value)}
              className="w-1/3 shared-select-gray-2 border-[1px] border-fillLight"
            >
              <option value="">링크 선택</option>
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <input
              type="url"
              id="secondLink"
              name="secondLink"
              value={secondLink}
              onChange={(e) => setSecondLink(e.target.value)}
              placeholder="링크를 입력하세요."
              className="w-2/3 shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default HubProfileForm;
