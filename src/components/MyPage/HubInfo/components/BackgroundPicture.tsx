"use client";

import React, { useMemo } from "react";
import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserStore } from "@/stores/useUserStore";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import { useToastStore } from "@/stores/useToastStore";
import { stripQuery, DEFAULT_BACKGROUND_IMAGE } from "@/utils/Image/imageUtils";

const BackgroundPicture: React.FC = () => {
  const { showToast } = useToastStore();
  const {
    userData,
    backgroundImageUrl,
    imageVersion,
    setBackgroundImageUrl,
    incrementImageVersion,
  } = useUserStore();



   // 이미지 업로드 및 초기화 관련 로직 제공 훅
   const { uploadImage, resetImage } = useImageUploadManager(
    userData?.user_id ?? null,
    "background"
  );

   // 캐시 무효화를 위한 버전 기반 이미지 URL 생성
  const imageUrl = useMemo(() => {
    const base = stripQuery(backgroundImageUrl ?? DEFAULT_BACKGROUND_IMAGE);
    return `${base}?v=${imageVersion}`;
  }, [backgroundImageUrl, imageVersion]);

  // 이미지 업로드 처리 핸들러
  const handleUpload = async (file: File) => {
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      const cleanUrl = stripQuery(uploadedUrl);
      setBackgroundImageUrl(cleanUrl);
      incrementImageVersion();
    }
  };

  // 기본 이미지로 초기화 처리 핸들러
  const handleReset = async () => {
    await resetImage();
    setBackgroundImageUrl(DEFAULT_BACKGROUND_IMAGE);
    incrementImageVersion();
  };

  return (
    <div className="px-6 pt-6 pb-10 s:p-0 s:pb-4">
      <label className="block text-subtitle ml-12 font-baseBold text-labelNeutral mb-5">
        커버 이미지
      </label>

      <div className="flex flex-col items-start gap-4">
        <ImageUploader
          imageUrl={imageUrl}
          onUpload={handleUpload}
          onError={(msg) => showToast(msg, "error")}
          type="background"
        />
        <button
          type="button"
          onClick={() => void handleReset()}
          className="mt-4 px-4 py-2 ml-7 bg-primary text-black rounded-md md:hover:bg-gray-700 transition-all duration-200 text-sm"
        >
          기본 이미지로 변경
        </button>
      </div>
    </div>
  );
};

export default BackgroundPicture;