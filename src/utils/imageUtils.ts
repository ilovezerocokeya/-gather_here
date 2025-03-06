export const secureImageUrl = (url: string | null) => {
    if (!url) return "/assets/header/user.svg"; // 기본 프로필 이미지 제공
  
    let secureUrl = url.replace(/^http:/, "https:"); // HTTP → HTTPS 변환
  
    // Supabase Storage URL이면 최적화된 크기와 WebP 적용
    if (secureUrl.includes("supabase.co/storage/v1/object/public")) {
      secureUrl += "?width=200&height=200&format=webp";
    }
  
    return secureUrl;
  };