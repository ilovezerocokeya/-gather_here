export const convertToWebp = async (
  file: File,
  maxWidth = 300,
  maxHeight = 160
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // 리사이즈가 필요한 경우에만 비율에 맞게 줄임
        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const widthRatio = maxWidth / targetWidth;
          const heightRatio = maxHeight / targetHeight;
          const ratio = Math.min(widthRatio, heightRatio);
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

        // WebP 변환
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
          0.75
        );
      };

      img.onerror = () => reject(new Error("이미지 로딩 실패"));
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));

    reader.readAsDataURL(file);
  });
};