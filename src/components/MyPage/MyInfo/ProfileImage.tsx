"use client";

import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserData } from "@/provider/user/UserDataProvider";
import { updateProfileImage } from "./actions/updateProfileImage";


interface ProfileImageProps {
    initialImageUrl: string;
    onImageChange: (url: string) => void;
    onToast: (state: "success" | "error", message: string) => void;
  }

const defaultImage = "/assets/header/user.svg"; // 기본 이미지 URL
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL; // 아이콘 이미지 base URL

// 직군별 아이콘 목록 구성
const iconOptions = [
  "프론트엔드", "백엔드", "IOS", "안드로이드", "데브옵스",
  "디자인", "PM", "기획", "마케팅",
].map((role, i) => ({
  label: role,
  url: `${imageBaseUrl}/profileicon_dark_${String(i + 1).padStart(2, "0")}.png`,
}));

const ProfileImage: React.FC<ProfileImageProps> = ({ initialImageUrl, onImageChange, onToast }) => {
  const { setUserData } = useUserData();  // 유저 상태 및 setter


  // 서버 액션 호출만 담당
  const uploadProfileImage = async (file: File | Blob) => {
    try {
      const url = await updateProfileImage(file); // 서버에서 업로드 + DB 저장 처리
      onImageChange(url); // 부모 컴포넌트 상태 반영
      setUserData((prev) => (prev ? { ...prev, profile_image_url: url } : prev)); // 컨텍스트 반영
      onToast("success", "프로필 이미지가 변경되었습니다.");
    } catch (err) {
      console.error("업로드 실패:", err);
      onToast("error", "이미지 업로드에 실패했습니다.");
    }
  };

  // 외부 URL (아이콘 등) → Blob 변환 후 업로드 처리
  const handleUploadFromUrl = async (url: string) => {
    try {
      const blob = await (await fetch(url)).blob();
      await uploadProfileImage(blob);
    } catch (err) {
      console.error("아이콘 이미지 업로드 실패:", err);
      onToast("error", "이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="space-y-4 border-b border-fillNormal pb-6 mb-6">
        {/* 섹션 제목 */}
        <h2 className="text-subtitle font-baseBold text-labelNeutral">프로필 이미지</h2>  
        {/* 이미지 업로드 */}
        <ImageUploader
          initialImageUrl={initialImageUrl || defaultImage}
          onUpload={(url) => onImageChange(url)}
        /> 
        {/* 선택 가능한 프로필 아이콘 리스트 */}
        <div className="grid grid-cols-5 m:grid-cols-3 gap-2">
          {iconOptions.map(({ url, label }) => (
            <button
              key={url}
              type="button"
              className="w-[52px] h-[52px] rounded-full overflow-hidden bg-fillNeutral"
              onClick={() => void handleUploadFromUrl(url)}
            >
              <img src={url} alt={label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileImage;