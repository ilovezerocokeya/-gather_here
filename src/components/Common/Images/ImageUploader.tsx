"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  imageUrl: string; // 현재 이미지 URL
  onUpload: (file: File) => Promise<void>; // 업로드 후 처리 함수
  onError?: (message: string) => void; // 에러 발생 시 처리 함수
}

// 확장자 + MIME 타입 둘 다 검사해서 안전하게 막기
const isValidImage = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const allowedExts = ["jpg", "jpeg", "png"];
  const ext = file.name.split(".").pop()?.toLowerCase();
  const mime = file.type;

  return !!ext && !!mime && allowedExts.includes(ext) && allowedTypes.includes(mime);
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onUpload, onError }) => {
  const [uploading, setUploading] = useState(false); // 업로드 중인지 상태
  const inputRef = useRef<HTMLInputElement | null>(null); // 숨겨진 input 클릭용

  // 버튼 누르면 input 작동시키기
  const handleClick = () => inputRef.current?.click();

  // 파일 선택되면 호출됨
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImage(file)) {
      onError?.("이미지 업로드는 jpg, jpeg, png 형식만 가능합니다.");
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      onError?.("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-36 h-36 s:w-30 s:h-30 rounded-[20px] overflow-hidden bg-fillLight flex items-center justify-center s:mb-3 relative group">
      {/* 로딩 중일 때 UI */}
      {uploading ? (
        <div className="w-full h-full flex items-center justify-center bg-black/50 text-white z-10">
          업로드 중...
        </div>
      ) : (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt="프로필 이미지"
          fill
          className="object-cover rounded-[20px]"
        />
      )}

      {/* hover 시 보여지는 화면 */}
      {!uploading && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center justify-center"
        >
          <span className="text-white text-6xl">🖼️</span>
        </button>
      )}

      {/* 실제 파일 선택 input */}
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