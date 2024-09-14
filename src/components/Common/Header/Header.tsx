"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/Login/LoginForm";
import { useUser } from "@/provider/UserContextProvider";
import { createClient } from "@/utils/supabase/client";
import useSearch from "@/hooks/useSearch";

const supabase = createClient();

const Header: React.FC = () => {
  const { user, userData, fetchUserData, initializationUser, resetAuthUser } = useUser();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMypageModalOpen, setIsMypageModalOpen] = useState(false);
  const defaultImage = "/assets/header/user.svg";
  const { searchWord, setSearchWord, handleSearch } = useSearch();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return;
    }

    resetAuthUser();
    initializationUser();
    router.push("/");
  };


  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMypageModal = () => {
    setIsMypageModalOpen(!isMypageModalOpen);
  };

  const handleOpenLoginModal = () => {
    setIsModalOpen(true);
    setIsMypageModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleClickPost = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      evt.preventDefault();
      handleOpenLoginModal();
    }
  };

  const closeModalOnRouteChange = () => {
    if (window.innerWidth <= 768 && isMypageModalOpen) {
      setIsMypageModalOpen(false);
    }
  };

  const getProfileImageUrl = (url: string) => `${url}?${new Date().getTime()}`;

  return (
    <header className="bg-background shadow-md relative text-fontWhite">
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s flex justify-between items-center py-[14px] s:py-2">
        <Link href="/">
          <Image
            src="/assets/header/logo.svg"
            alt="@gather_here 로고"
            priority
            width={182}
            height={25}
            className="s:hidden"
          />
          <Image
            src="/assets/header/mobile_logo.svg"
            alt="@gather_here 로고"
            priority
            width={20}
            height={24}
            className="hidden s:block"
          />
        </Link>
        <Suspense>
          <nav className="flex items-center gap-2">
            <form className="relative s:hidden items-center overflow-hidden" onSubmit={handleSearch}>
              <label htmlFor="input" className="sr-only">
                검색창
              </label>
              <input
                type="text"
                id="input"
                name="input"
                placeholder="검색어를 입력해보세요"
                className="shared-input-thin-gray text-labelAssistive w-[335px]"
                value={searchWord}
                onChange={(evt) => setSearchWord(evt.target.value)}
              />
              <button className="absolute top-[9px] right-[8px]" type="submit">
                <Image src="/assets/header/search.svg" width={20} height={20} alt="검색 버튼 아이콘" />
              </button>
            </form>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSearch}
                type="submit"
                className="hidden s:flex items-center justify-center w-[36px] h-[36px] rounded-lg bg-fillNeutral hover:bg-fillAssistive pt-1"
              >
                <Image src="/assets/header/search.svg" width={22} height={22} alt="검색 버튼 아이콘" />
              </button>
              <Link onClick={(evt) => handleClickPost(evt)} href="/post" passHref>
                <button className="square-header-button-gray">
                  <Image src="/assets/header/write.svg" width={16} height={16} alt="글쓰기 버튼 아이콘" />
                </button>
              </Link>
              {user ? (
                <div className="flex items-center">
                  <button
                    onClick={toggleMypageModal}
                    className="hidden s:flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-fillNeutral hover:bg-fillAssistive  z-50"
                  >
                    <Image
                      src={isMypageModalOpen ? "/assets/header/primary_close.svg" : "/assets/header/mobile_logo.svg"}
                      alt={isMypageModalOpen ? "닫기 버튼 아이콘" : "마이페이지 아이콘"}
                      priority
                      width={14}
                      height={16}
                    />
                  </button>
                  <Link href="/mypage" className="square-header-button-gray s:hidden">
                    <Image
                      src="/assets/header/mobile_logo.svg"
                      alt="마이페이지 아이콘"
                      priority
                      width={14}
                      height={16}
                    />
                  </Link>
                  <button onClick={signOut} className="shared-button-small-gray-2 ml-2 s:hidden">
                    로그아웃
                  </button>
                </div>
              ) : (
                <button onClick={handleOpenLoginModal} className="shared-button-small-green">
                  시작하기
                </button>
              )}
            </div>
          </nav>
        </Suspense>
      </div>
      {isSearchOpen && (
        <Suspense>
          <form
            className="absolute top-0 left-0 w-full bg-background z-50 p-2 flex items-center s:block"
            onSubmit={handleSearch}
          >
            <label htmlFor="search" className="sr-only">
              검색창
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="검색어를 입력해보세요"
              className="shared-input-thin-gray w-full"
              value={searchWord}
              onChange={(evt) => setSearchWord(evt.target.value)}
            />
            <button
              type="button"
              onClick={toggleSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <Image src="/assets/header/close.svg" alt="닫기 버튼" width={16} height={16} />
            </button>
          </form>
        </Suspense>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={handleCloseLoginModal}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-4 z-50">
            <button
              onClick={handleCloseLoginModal}
              className="ml-auto mt-1 mr-1 block text-right p-1 text-3xl text-[fontWhite] hover:text-[#777]"
            >
              &times;
            </button>
            <LoginForm />
          </div>
        </>
      )}
      {isMypageModalOpen && user && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleMypageModal}></div>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-[80%] border-[1px] border-fillLight bg-fillStrong shadow-lg rounded-lg p-5 z-50 s:block hidden">
            <div className="flex items-center mb-4 pb-4 border-b-[1px] border-b-fillLight">
              <div className="w-12 h-12 bg-fillNeutral rounded-[12px] flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full rounded-[12px]">
                  <Image
                    src={getProfileImageUrl(userData?.profile_image_url || defaultImage)}
                    alt="프로필 이미지"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-[12px]"
                  />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-fontWhite font-subtitle">{userData?.nickname}</p>
                <p className="text-baseXs text-labelNormal">
                  {userData?.job_title} {userData?.experience}
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mypage"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  프로필 수정
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/myinterests"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  내 관심글
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/myposts"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  내 작성글
                </Link>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="block w-full text-left text-labelNormal font-base hover:text-fontWhite"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
