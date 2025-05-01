"use client";

import React, { useMemo, useState } from "react";
import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserData } from "@/provider/user/UserDataProvider";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import Toast from "@/components/Common/Toast/Toast";
import { DEFAULT_PROFILE_IMAGE, stripQuery } from "@/utils/Image/imageUtils";

interface ProfileImageProps {
  onImageChange?: (url: string) => void;
  onToast: (state: "success" | "error" | "info", message: string) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onImageChange, onToast }) => {
  const { userData, setUserData } = useUserData();
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

  const {
    uploadImage,
    resetImage,
    imageVersion,
  } = useImageUploadManager(
    userData?.user_id ?? null,
    userData?.profile_image_url ?? null,
    (state, msg) => {
      onToast(state, msg);
      setToast({ state, message: msg });
    },
    "profile"
  );

  // 쿼리스트링 제거 후 캐시 버전 추가
  const imageUrl = useMemo(() => {
    const base = stripQuery(userData?.profile_image_url ?? DEFAULT_PROFILE_IMAGE);
    return `${base}?v=${imageVersion}`;
  }, [userData?.profile_image_url, imageVersion]);

  const handleUpload = async (file: File) => {
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      // 쿼리스트링 제거해서 순수 URL만 상태에 저장
      const cleanUrl = stripQuery(uploadedUrl);
      setUserData(prev =>
        prev ? {
          ...prev,
          profile_image_url: cleanUrl,
          imageVersion: (prev.imageVersion ?? 0) + 1,
        } : prev
      );
      onImageChange?.(cleanUrl);
    }
  };

  const handleReset = async () => {
    await resetImage();
    setUserData((prev) =>
      prev ? { ...prev, profile_image_url: DEFAULT_PROFILE_IMAGE } : prev
    );
  };

  return (
    <div className="border-b border-fillNormal pb-6 mb-6">
      <label className="block text-subtitle font-baseBold text-labelNeutral ml-10 mb-4">프로필 사진</label>
      <div className="flex flex-col items-start gap-4">
        <ImageUploader
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