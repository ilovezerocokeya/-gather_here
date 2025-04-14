"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import Toast from "@/components/Common/Toast/Toast";
import ImageUploader from "@/components/Common/Images/ImageUploader";

const BackgroundPicture: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // 현재 표시할 배경 이미지 URL 상태
  const defaultImage = useMemo(() => "/assets/mypage/image_upload.svg", []); // 기본 배경 이미지 URL을 메모이제이션
  const { user } = useAuth(); // 인증된 사용자 정보
  const { userData, setUserData } = useUserData(); // 사용자 데이터 전역 상태
  // 토스트 메시지 상태
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

  // Supabase Storage에 이미지 업로드 후, 사용자 데이터의 배경 이미지 URL을 업데이트하는 함수
  const uploadBackgroundImage = useCallback(async (file: File | Blob) => {
    if (!user?.id) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    try {
      // 파일 이름 및 업로드 경로 생성
      const fileName = `background_${btoa(user.id)}.png`;
      const path = `backgroundImages/${fileName}`;

      // Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      // public URL 가져오기
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(path);
      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      if (!publicUrl) throw new Error("배경 이미지 URL을 얻지 못했습니다.");

      const versionedUrl = `${publicUrl}?t=${Date.now()}`; // 캐시 무효화용 쿼리

      // Supabase DB에 사용자 레코드 업데이트
      const { error: updateError } = await supabase
        .from("Users")
        .update({ background_image_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw new Error(updateError.message);

      // 로컬 상태 및 전역 상태 업데이트
      setBackgroundImage(versionedUrl); // 쿼리 붙인 URL을 로컬 상태에 저장
      setUserData((prev) => prev ? { ...prev, background_image_url: versionedUrl } : prev);

      setToast({ state: "success", message: "배경 이미지 업데이트 완료되었습니다." }); // 성공 토스트 메시지 표시
    } catch (e) {
      console.error(e);
      setToast({ state: "error", message: "배경 이미지 업데이트에 실패했습니다." }); // 실패 토스트 메시지 표시
    }
  }, [user?.id, setUserData]);

  // 전역 상태에 있는 배경 이미지 URL을 로컬 상태로 반영
  useEffect(() => {
    if (userData?.background_image_url && userData.background_image_url !== backgroundImage) {
      setBackgroundImage(userData.background_image_url);
    }
  }, [userData]);

  return (
    <div className="px-6 pt-6 pb-10 s:p-0 s:pb-4">
      <label className="block text-subtitle font-baseBold text-labelNeutral mb-5">커버 이미지</label>

      {/* 이미지 업로더 컴포넌트 */}
      <ImageUploader
        imageUrl={backgroundImage ?? defaultImage}
        onUpload={uploadBackgroundImage}
        onError={(msg) => setToast({ state: "error", message: msg })}
      />

      {/* 토스트 메시지 표시 */}
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