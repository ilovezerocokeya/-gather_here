const IMAGE_QUALITY = 0.93; 

export const convertToWebp = async (
  file: File,
  type: "profile" | "background"
): Promise<File> => {
  const config = {
    profile: { maxWidth: 800, maxHeight: 800 },
    background: { maxWidth: 1600, maxHeight: 900 },
  }[type];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

     // 이미지 파일을 base64로 읽음
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // 리사이즈가 필요한 경우에만 비율에 맞게 줄임
        if (targetWidth > config.maxWidth || targetHeight > config.maxHeight) {
          const ratio = Math.min(config.maxWidth / targetWidth, config.maxHeight / targetHeight);
          targetWidth = Math.floor(targetWidth * ratio);
          targetHeight = Math.floor(targetHeight * ratio);
        }

        // canvas에 리사이즈된 이미지 그리기
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context 가져오기 실패"));

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

       // WebP변환 후 File 객체로 반환
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("WebP 변환 실패"));
            const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          "image/webp",
          IMAGE_QUALITY
        );
      };


      img.onerror = () => reject(new Error("이미지 로딩 실패"));
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));

    reader.readAsDataURL(file);
  });
};