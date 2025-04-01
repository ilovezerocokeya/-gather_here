import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { CardModalProps } from '@/lib/gatherHub';

const CardModal: React.FC<CardModalProps> = ({
  isModalOpen,
  closeModal,
  nickname,
  job_title,
  experience,
  description,
  profile_image_url,
  background_image_url,
  blog,
  liked,
  answer1,
  answer2,
  answer3,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  handleToggleLike,
  secureImageUrl,
  selectedTechStacks,
}) => {

  const [hasMounted, setHasMounted] = useState(false);

  // hydration mismatch 방지를 위한 마운트 체크
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열려 있을 때 페이지 스크롤을 막음
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
       // 모달이 닫힐 때 스크롤을 다시 허용
      document.body.style.overflow = "auto";
    }

    return () => {
      // 이벤트 리스너를 정리하여 메모리 누수를 방지
    document.body.style.overflow = "auto";
    window.removeEventListener("keydown", handleEsc);
  };
}, [isModalOpen, handleEsc]);

  // 모달이 닫혀 있을 경우 렌더링하지 않음
  if (!isModalOpen || !hasMounted) return null;

  
  
  return createPortal(
    <div
      className="fixed inset-0 bg-background opacity-80 flex justify-center items-center z-50"
      onClick={closeModal}
      style={{ userSelect: "none" }}
    >
      <div
        className="bg-background rounded-3xl shadow-lg s:w-[400px] s:h-[600px] w-[744px] h-[800px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
        style={{
          opacity: isModalOpen ? 1 : 0,
          transform: isModalOpen ? "scale(1)" : "scale(0.95)",
          userSelect: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-[#1919a] text-3xl font-bold rounded-full p-4 hover:text-black hover:scale-110 transition-transform duration-200 ease-in-out z-50"
          onClick={closeModal}
          style={{ userSelect: "none" }}
        >
          &times;
        </button>

        {/* 대표 포트폴리오 이미지 */}
        <div
          className="relative h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
          onClick={() => window.open(blog, "_blank")}
          style={{ userSelect: "none" }}
        >
          <Image
            src={secureImageUrl(background_image_url) || "/logos/defaultBackgroundImage.svg"}
            alt="배경 이미지"
            fill
            quality={80}
            priority
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* 프로필 정보 */}
        <div className="relative">
          <div className="absolute -top-20 flex flex-col items-start p-6">
            <div className="w-[120px] h-[120px] rounded-2xl bg-white border-1 border-background overflow-hidden">
              <Image
                src={secureImageUrl(profile_image_url)}
                alt={nickname}
                width={120}
                height={120}
                quality={90}
                priority                
                className="object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="mt-5">
              <h2 className="text-xl font-medium text-f7f7f7 font-['Pretendard'] leading-7">{nickname}</h2>
              <p className="text-primary mt-1 text-sm font-normal font-['Pretendard'] leading-[21px]">
                {job_title}
                <span className="text-[#5e5e5e] text-sm font-normal font-['Pretendard'] leading-[21px]">
                  &nbsp; |&nbsp; {experience}
                </span>
              </p>
            </div>
          </div>
        

          {/* 버튼 영역 */}
          <div className="absolute top-[-25px] right-[20px] flex items-center space-x-4 p-2">
            <button
              onClick={handleToggleLike}
              className={`p-3 rounded-xl transition flex items-center space-x-2 ${
                liked ? "bg-gray-800 text-white" : "bg-[#28282a] text-white"
              } hover:bg-gray-900`}
              style={{ userSelect: "none" }}
            >
              <Image
                src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
                alt="북마크"
                width={16}
                height={16}
                loading="lazy"
              />
              <span className={`hidden md:block`}>북마크 저장하기</span>
            </button>

            <div className="relative group">
              <button
                  className="bg-[#28282a] text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition flex items-center space-x-2"
                  style={{ userSelect: "none", cursor: "not-allowed" }}
                  disabled
              >
                <Image 
                  src="/assets/chat.svg" 
                  alt="메시지 아이콘" 
                  width={20} 
                  height={20} 
                />
                <span className="hidden md:block" suppressHydrationWarning>
                  대화 신청하기
                </span>
              
                {/* 말풍선 */}
                <div className="absolute top-[100%] s:left-[50%] left-[65%] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  현재 개발 중인 <br /> 기능 입니다.
                  <div className="absolute top-[-6px] s:left-[70%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
            <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mt-40 mx-5"></div>
        
        {/* 자기소개 섹션 */}
        <div className="h-[92px] justify-start p-6 items-start gap-5 inline-flex space-x-8 md:space-x-20">
          <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">자기소개</div>
          </div>
          <div className="s:w-[240px] md:w-[524px] flex-col justify-start items-start inline-flex">
            <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
              <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                  {description}
                </div>
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <div className="h-4 p-2.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mx-5" style={{ marginTop: "50px" }}></div>

        <div className="h-[411px] justify-start p-6 items-start gap-5 inline-flex space-x-6 md:space-x-16">
          {/* 공통질문 */}
          <div className="h-[29px] p-2 justify-start items-center gap-1 flex">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
              공통 질문
            </div>
          </div>

          <div className="s:w-[240px] md:w-[524px] flex-col justify-start items-start gap-6 inline-flex">
            {/* 질문1 */}
            <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                    {answer1}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 질문2 */}
            <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  2. 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                    {answer2}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>  

            {/* 질문3 */}
            <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
              <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                  3. 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해왔는지 이야기해 주세요.
                </div>
              </div>
              <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                  <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                    {answer3}
                  </div>
                  <div className="w-6 h-6 p-1 justify-center items-center flex">
                    <div className="h-4 p-2.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[90px] mt-[54px] mx-5"></div>

        {/* 기술 스택 */}
        <div className="h-8 justify-start items-start p-6 gap-5 inline-flex space-x-20">
          <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
            <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">기술 스택</div>
          </div>
          <div className="flex items-center gap-2">
            {selectedTechStacks.map((stack) => (
              <div key={stack.id} className="px-3 py-2 bg-[#28282a] rounded-full border border-[#2d2d2f] flex items-center gap-2">
                <Image src={stack.image} alt={stack.name} width={12} height={12} />
                <span className="text-white text-xs font-medium">{stack.name}</span>
              </div>
            ))}
          </div>
        </div>

            <div className="w-240px border-t border-gray-500 border-opacity-40 mx-5" style={{ marginTop: "50px" }}></div>

        {/* URL 링크 */}
        <div className="h-9 justify-start items-start gap-5 inline-flex p-6 space-x-20">
          <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
            <div className="w-[52px] text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">
              URL
            </div>
          </div>

          <div className="grow shrink basis-0 h-9 justify-start items-center gap-2 flex">
            {/* Blog 링크 */}
            <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
              <Link href={blog || "#"} target="_blank" className="flex justify-center items-center">
                <Image
                  src="/Link/link.svg"
                  alt="링크"
                  width={24}
                  height={24}
                />
              </Link>
            </div>

            {/* 첫 번째 링크 */}
            {first_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                <Link href={first_link || "#"} target="_blank" className="flex justify-center items-center">
                <Image
                  src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"}
                  alt={`${first_link_type} Link`}
                  width={24}
                  height={24}
                />
                </Link>
              </div>
            )}

            {/* 두 번째 링크 */}
            {second_link && (
              <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                <Link href={second_link || "#"} target="_blank" className="flex justify-center items-center">
                  <Image
                    src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"}
                    alt={`${second_link_type} Link`}
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

            <div className="w-240px border-t border-gray-500 border-opacity-10 mx-5" style={{ marginTop: "50px" }}></div>
      
      </div>
    </div>,
    document.body
  );
};

export default CardModal;