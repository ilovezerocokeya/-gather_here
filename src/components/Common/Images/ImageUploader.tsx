"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";

interface ImageUploaderProps {
  initialImageUrl?: string;         // 초기 이미지 URL 
  onUpload: (url: string) => void;  // 업로드 완료 후 부모 컴포넌트에 URL 전달
  onError?: (message: string) => void;
}

// 유효한 이미지 파일인지 검사하는 함수
const isValidImage = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const allowedExts = ["jpg", "jpeg", "png"];
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext && allowedExts.includes(ext) && allowedTypes.includes(file.type);
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImageUrl, onUpload, onError }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? "");  // 현재 이미지 URL
  const [uploading, setUploading] = useState(false);                // 업로드 중 여부
  const inputRef = useRef<HTMLInputElement | null>(null);           // 숨겨진 파일 input 참조

  // 이미지 선택 버튼 클릭 시 input 요소 클릭 유도
  const handleClick = () => inputRef.current?.click();

  // 파일 선택 후 실행되는 업로드 핸들러
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isValidImage(file)) {
      onError?.("jpg, jpeg, png 형식의 이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      console.error("업로드 실패:", err);
      onError?.("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

    // 실제 업로드 처리 분리
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const fileName = `profile_${Date.now()}.${ext}`;
    const filePath = `profileImages/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("URL 생성 실패");

    return data.publicUrl;
  }

  const displayImage = imageUrl || "/assets/header/user.svg";  // 표시할 이미지 (없으면 기본 이미지)

  return (
    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-fillLight">
      {/* 업로드 중일 경우 로딩 문구, 아니면 이미지 표시 */}
      {uploading ? (
        <div className="w-full h-full flex items-center justify-center">업로드 중...</div>
      ) : (
        <Image 
            src={displayImage} 
            alt="프로필 이미지" 
            fill className="object-cover" 
        />
      )}

      {/* 이미지 클릭 시 파일 업로드 input 활성화 */}
      <button
        type="button"
        onClick={handleClick}
        className="absolute inset-0 hover:bg-black/40 text-white flex items-center justify-center"
      >
        수정
      </button>

      {/* 실제로 파일을 선택하는 input 요소 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => void handleChange(e)}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;