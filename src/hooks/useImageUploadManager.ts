"use client";

import { useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { convertToWebp } from "@/utils/Image/convertToWebp";
import { updateUserImage } from "@/components/MyPage/MyInfo/actions/updateUserImage";
import {
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_BACKGROUND_IMAGE,
  getStoragePath,
  getImageSize,
  stripQuery,
} from "@/utils/Image/imageUtils";
import { useUserStore } from "@/stores/useUserStore";

type UploadType = "profile" | "background";

export function useImageUploadManager(
  userId: string | null,
  onToast: (state: "success" | "error" | "info", message: string) => void,
  type: UploadType
) {
  const {
    imageVersion,
    incrementImageVersion,
    setProfileImageUrl,
    setBackgroundImageUrl,
    fetchUserData,
  } = useUserStore();

  const defaultImage =  type === "profile" ? DEFAULT_PROFILE_IMAGE : DEFAULT_BACKGROUND_IMAGE;

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));  // 비동기 지연을 위한 유틸 함수

  // 이미지 업로드 핸들러
  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        if (!userId) throw new Error("유저 정보 없음");

        const path = getStoragePath(type, userId);
        console.log(`[Upload] [START] 업로드 시작 - 타입: ${type}, 유저ID: ${userId}`);
        console.log(`[Upload] 스토리지 경로: ${path}`);

        // 기존 이미지 삭제
        const { error: removeError } = await supabase.storage
          .from("images")
          .remove([path]);

        if (removeError) {
          console.warn("[Upload] 기존 이미지 삭제 실패 (계속 진행):", removeError.message);
        } else {
          console.log("[Upload] 기존 이미지 삭제 성공");
        }

        // 캐시 무효화를 위한 딜레이
        await delay(700);

        // WebP 변환
        const { width, height } = getImageSize(type);
        const webpFile = await convertToWebp(file, width, height);
        console.log("[Upload] WebP 변환 완료:", webpFile.size, "bytes");

        // 업로드 (덮어쓰기 허용)
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(path, webpFile, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);
        console.log("[Upload] Supabase 업로드 성공");

        // 공개 URL
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (!publicUrl) throw new Error("공개 URL 생성 실패");

        const cleanUrl = stripQuery(publicUrl);
        console.log("[Upload] 최종 URL:", cleanUrl);

        // 우선 로컬 상태에 반영 → UI 먼저 반응
        if (type === "profile") {
          setProfileImageUrl(cleanUrl);
        } else {
          setBackgroundImageUrl(cleanUrl);
        }
        incrementImageVersion();

        
        await updateUserImage(type, publicUrl); // Supabase DB 업데이트
        console.log("[Upload] DB 업데이트 완료");

        
        await fetchUserData(userId); // 동기화를 위한 fetch

        onToast("success", "이미지가 변경되었습니다.");
        return publicUrl;
      } catch (err) {
        console.error("[Upload] 업로드 실패:", err);
        onToast("error", "이미지 업로드에 실패했습니다.");
        return null;
      }
    },
    [
      userId,
      onToast,
      type,
      incrementImageVersion,
      setProfileImageUrl,
      setBackgroundImageUrl,
      fetchUserData,
    ]
  );

  // 기본 이미지로 리셋 핸들러
  const resetImage = useCallback(async () => {
    try {
      if (!userId) throw new Error("유저 정보 없음");

      await updateUserImage(type, defaultImage); // Supabase DB 업데이트

      // 상태 업데이트
      if (type === "profile") {
        setProfileImageUrl(DEFAULT_PROFILE_IMAGE);
      } else {
        setBackgroundImageUrl(DEFAULT_BACKGROUND_IMAGE);
      }
      incrementImageVersion();

      await fetchUserData(userId); // 동기화를 위한 fetch

      console.log("[Reset] 기본 이미지로 초기화 완료");
      onToast("success", "기본 이미지로 변경되었습니다.");
    } catch (err) {
      console.error("[Reset] 기본 이미지 변경 실패:", err);
      onToast("error", "기본 이미지 변경에 실패했습니다.");
    }
  }, [
    userId,
    onToast,
    type,
    incrementImageVersion,
    setProfileImageUrl,
    setBackgroundImageUrl,
    fetchUserData,
  ]);

  return {
    uploadImage,
    resetImage,
    imageVersion,
  };
}