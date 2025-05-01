"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { convertToWebp } from "@/utils/Image/convertToWebp";
import { updateUserImage } from "@/components/MyPage/MyInfo/actions/updateUserImage";
import { DEFAULT_PROFILE_IMAGE, DEFAULT_BACKGROUND_IMAGE, getStoragePath, getImageSize } from "@/utils/Image/imageUtils";

type UploadType = "profile" | "background";

// 이미지 업로드 및 초기화 커스텀 훅
export function useImageUploadManager(
  userId: string | null,
  currentImageUrl: string | null,
  onToast: (state: "success" | "error" | "info", message: string) => void,
  type: UploadType = "profile"
) {
  const [imageVersion, setImageVersion] = useState(0);

  const defaultImage =
    type === "profile" ? DEFAULT_PROFILE_IMAGE : DEFAULT_BACKGROUND_IMAGE;

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        if (!userId) throw new Error("유저 정보 없음");

        const path = getStoragePath(type, userId);
        const { width, height } = getImageSize(type);
        const webpFile = await convertToWebp(file, width, height);

        // Supabase 스토리지에 업로드 (덮어쓰기)
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(path, webpFile, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        // 공개 URL 가져오기
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (!publicUrl) throw new Error("공개 URL 생성 실패");

        // 서버 액션 호출 (기존 이미지 삭제 + DB 업데이트)
        await updateUserImage(type, publicUrl);

        // 버전 증가 → 캐시 무효화
        const nextVersion = imageVersion + 1;
        setImageVersion(nextVersion);

        onToast("success", "이미지가 변경되었습니다.");
        return `${publicUrl}?v=${nextVersion}`;
      } catch (err) {
        console.error(err);
        onToast("error", "이미지 업로드에 실패했습니다.");
        return null;
      }
    },
    [userId, imageVersion, onToast, type]
  );

  const resetImage = useCallback(async () => {
    try {
      if (!userId) throw new Error("유저 정보 없음");

      // 서버 액션으로 기본 이미지로 전환
      await updateUserImage(type, defaultImage);

      setImageVersion((v) => v + 1);
      onToast("success", "기본 이미지로 변경되었습니다.");
    } catch (err) {
      console.error(err);
      onToast("error", "기본 이미지 변경에 실패했습니다.");
    }
  }, [userId, onToast, defaultImage, type]);

  return {
    uploadImage,
    resetImage,
    imageVersion,
  };
}