
export const DEFAULT_PROFILE_IMAGE = "/assets/header/user.svg";
export const DEFAULT_BACKGROUND_IMAGE = "/logos/welcomeImage.svg";

 // 안전한 이미지 URL 생성: http → https 변환 + 쿼리스트링 제거
export const secureImageUrl = (url: string | null): string => {
  if (!url) return DEFAULT_PROFILE_IMAGE;

  const secureUrl = url.replace(/^http:/, "https:");
  return secureUrl.split("?")[0];
};

// 쿼리스트링 제거 유틸
export const stripQuery = (url: string | null | undefined): string =>
  url?.split("?")[0] ?? "";

// 이미지 경로 추출
export const getImagePathFromUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const segments = url.split("/").slice(-2);
  return segments.length === 2 ? segments.join("/") : null;
};

// 스토리지 경로 반환
export const getStoragePath = (type: "profile" | "background", userId: string) =>
  `${type === "profile" ? "profileImages" : "backgroundImages"}/${type}_${userId}.webp`;

// 타입별 사이즈 반환
export const getImageSize = (type: "profile" | "background") =>
  type === "profile"
    ? { width: 240, height: 240 }
    : { width: 600, height: 320 };