import React, { useState } from "react";
import { useToastStore } from "@/stores/useToastStore";


const ShareButton: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false); // 버튼 클릭 시 효과용 상태
  const { showToast } = useToastStore();


  // 현재 페이지 URL을 클립보드에 복사
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showToast("URL 복사 완료하였습니다!" , "success" );
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
      })
      .catch(() => {
        showToast("URL 복사에 실패했습니다." , "error" );
      });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className={`flex items-center mr-2 ${isClicked ? "clicked" : ""}`}
        style={{
          width: "20px",
          height: "20px",
        }}
      >
        {/* 공유 아이콘 */}
        <svg width="24" height="24" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="... (path 생략) ..."
            fill={isClicked ? "#C3E88D" : "#5E5E5E"} // 클릭 시 색상 변경
          />
        </svg>
      </button>

    </>
  );
};

export default ShareButton;