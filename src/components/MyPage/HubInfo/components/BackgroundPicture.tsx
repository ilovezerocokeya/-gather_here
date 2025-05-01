"use client";

import React, { useMemo, useState } from "react";
import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserData } from "@/provider/user/UserDataProvider";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import Toast from "@/components/Common/Toast/Toast";
import {
  stripQuery,
  DEFAULT_BACKGROUND_IMAGE,
} from "@/utils/Image/imageUtils";

const BackgroundPicture: React.FC = () => {
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
    userData?.background_image_url ?? null,
    (state, msg) => setToast({ state, message: msg }),
    "background"
  );

  // 렌더링용 URL에만 ?v= 캐시 무효화 적용
  const imageUrl = useMemo(() => {
    const base = stripQuery(userData?.background_image_url ?? DEFAULT_BACKGROUND_IMAGE);
    return `${base}?v=${imageVersion}`;
  }, [userData?.background_image_url, imageVersion]);

  const handleUpload = async (file: File) => {
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      const cleanUrl = stripQuery(uploadedUrl); // 상태 저장 시 쿼리 제거
      setUserData(prev =>
        prev ? {
          ...prev,
          background_image_url: cleanUrl,
          imageVersion: (prev.imageVersion ?? 0) + 1,
        } : prev
      );
    }
  };

  const handleReset = async () => {
    await resetImage();
    setUserData((prev) =>
      prev ? { ...prev, background_image_url: DEFAULT_BACKGROUND_IMAGE } : prev
    );
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

export default BackgroundPicture;