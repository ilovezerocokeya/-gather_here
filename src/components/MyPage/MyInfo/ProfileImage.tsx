"use client";

import React, { useEffect, useMemo, useState } from "react";
import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserStore } from "@/stores/useUserStore";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import Toast from "@/components/Common/Toast/Toast";
import { DEFAULT_PROFILE_IMAGE, stripQuery } from "@/utils/Image/imageUtils";

interface ProfileImageProps {
  onImageChange?: (url: string) => void;
  onToast: (state: "success" | "error" | "info", message: string) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onImageChange, onToast }) => {
  const {
    userData,
    profileImageUrl,
    imageVersion,
    setProfileImageUrl,
    incrementImageVersion,
    fetchUserData,
  } = useUserStore();

  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

  // 이미지 업로드 및 초기화 관련 로직 제공 훅
  const { uploadImage, resetImage } = useImageUploadManager(
    userData?.user_id ?? null,
    (state, msg) => {
      onToast(state, msg);
      setToast({ state, message: msg });
    },
    "profile"
  );

  // 캐시 무효화를 위한 버전 기반 이미지 URL 생성
  const imageUrl = useMemo(() => {
    const base = stripQuery(profileImageUrl ?? DEFAULT_PROFILE_IMAGE);
    const fullUrl = `${base}?v=${imageVersion}`;
    console.log("[Render] 이미지 렌더링 URL:", fullUrl);
    return fullUrl;
  }, [profileImageUrl, imageVersion]);

  // 이미지 업로드 처리 핸들러
  const handleUpload = async (file: File) => {
    const uploadedUrl = await uploadImage(file);
    console.log("[ProfileImage] 업로드된 이미지 URL:", uploadedUrl);

    if (uploadedUrl) {
      const cleanUrl = stripQuery(uploadedUrl);
      console.log("[ProfileImage] 클린 이미지 URL:", cleanUrl);
      setProfileImageUrl(cleanUrl);
      incrementImageVersion();
      onImageChange?.(cleanUrl);
      await fetchUserData(userData?.user_id ?? ""); // 상태 일치
    }
  };

  // 기본 이미지로 초기화 처리 핸들러
  const handleReset = async () => {
    await resetImage();
    console.log("[ProfileImage] 기본 이미지로 리셋");
    setProfileImageUrl(DEFAULT_PROFILE_IMAGE);
    incrementImageVersion();
    await fetchUserData(userData?.user_id ?? ""); // 상태 일치
  };

  useEffect(() => {
    console.log("[ProfileImage] === 디버깅 정보 ===");
    console.log("[ProfileImage] userData.profile_image_url:", userData?.profile_image_url);
    console.log("[ProfileImage] profileImageUrl 상태값:", profileImageUrl);
    console.log("[ProfileImage] imageVersion 상태값:", imageVersion);
    console.log("[ProfileImage] 렌더링 URL:", imageUrl);
  }, [userData, profileImageUrl, imageVersion, imageUrl]);

  return (
    <div className="border-b border-fillNormal pb-6 mb-6">
      <label className="block text-subtitle font-baseBold text-labelNeutral ml-10 mb-4">프로필 사진</label>
      <div className="flex flex-col items-start gap-4">
        <ImageUploader
          key={imageUrl} // 캐시 강제 무효화
          imageUrl={imageUrl}
          onUpload={handleUpload}
          onError={(msg) => setToast({ state: "error", message: msg })}
        />
        <button
          type="button"
          onClick={() => void handleReset()}
          className="mt-4 px-4 py-2 ml-7 bg-primary text-black rounded-md hover:bg-gray-700 transition-all duration-200 text-sm"
        >
          기본 이미지로 변경
        </button>
      </div>
      {toast && (
        <Toast
          state={toast.state}
          message={toast.message}
          onClear={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfileImage;