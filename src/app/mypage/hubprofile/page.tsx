"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Common/Toast/Toast";
import { useUser } from "@/provider/UserContextProvider";
import TeamworkQuestions from "@/components/MyPage/HubInfo/TeamQuestions";

const HubProfile: React.FC = () => {
  const supabase = createClient();
  const { user, fetchUserData } = useUser();
  const [blog, setBlog] = useState("");
  const [firstLinkType, setFirstLinkType] = useState("");
  const [firstLink, setFirstLink] = useState("");
  const [secondLinkType, setSecondLinkType] = useState("");
  const [secondLink, setSecondLink] = useState("");
  const [toastState, setToastState] = useState({ state: "", message: "" });

  // 이미 저장된 사용자 데이터를 가져와 필드에 채우기
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("Users")
          .select("blog, first_link_type, first_link, second_link_type, second_link")
          .eq("user_id", user.id)
          .single(); // 해당 사용자 데이터를 불러옴

        if (data) {
          setBlog(data.blog || "");
          setFirstLinkType(data.first_link_type || "");
          setFirstLink(data.first_link || "");
          setSecondLinkType(data.second_link_type || "");
          setSecondLink(data.second_link || "");
        }

        if (error) {
          console.error("사용자 데이터를 가져오지 못했습니다:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]); // user가 변경될 때마다 데이터를 가져옴

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

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateUrl(blog) || (firstLink && !validateUrl(firstLink)) || (secondLink && !validateUrl(secondLink))) {
      setToastState({ state: "error", message: "유효한 URL을 입력하세요." });
      return;
    }

    if (!user) {
      setToastState({ state: "error", message: "사용자 정보가 없습니다." });
      return;
    }

    const { error } = await supabase
      .from("Users")
      .update({
        blog: blog,
        first_link_type: firstLinkType,
        first_link: firstLink,
        second_link_type: secondLinkType,
        second_link: secondLink,
      })
      .eq("user_id", user.id);

    if (error) {
      setToastState({ state: "error", message: "저장에 실패했습니다." });
    } else {
      setToastState({ state: "success", message: "저장되었습니다." });
      fetchUserData();
    }
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <fieldset className="p-6 s:p-0">
          <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">허브 프로필</h1>
          <div>
            <label htmlFor="blog" className="block text-sm font-medium text-labelNormal mb-1">
              포트폴리오 링크
            </label>
            <input
              type="url"
              id="blog"
              name="blog"
              value={blog}
              onChange={(e) => setBlog(e.target.value)}
              placeholder="포트폴리오 링크를 입력하세요."
              className="w-full shared-input-gray-2 border-[1px] border-fillLight"
            />
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

          <div className="mt-6 mb-12">
            <div className="s:fixed flex s:justify-center s:bottom-0 s:left-0 s:right-0 s:p-4 s:bg-background s:z-10">
              <div className="flex justify-end s:justify-center gap-2 w-full s:max-w-container-s">
                <button type="submit" aria-label="프로필 저장" className="shared-button-green w-[65px] s:w-1/2">
                  저장
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      <TeamworkQuestions />
    </section>
  );
};

export default HubProfile;
