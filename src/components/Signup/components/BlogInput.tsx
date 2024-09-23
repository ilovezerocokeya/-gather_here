import React, { useEffect } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form"; 
import { FormValues } from "../Signup03";

// BlogInputProps 인터페이스 정의: 블로그 입력 필드에 필요한 props
interface BlogInputProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  blogError: string | null;
  blogSuccess: string | null;
  setBlogError: (value: string | null) => void;
  setBlogSuccess: (value: string | null) => void;
  validateUrl: (url: string) => boolean;
}

const BlogInput: React.FC<BlogInputProps> = ({
  register,
  watch,
  blogError,
  blogSuccess,
  setBlogError,
  setBlogSuccess,
  validateUrl,
}) => {
  const blog = watch("blog"); // 블로그 필드의 상태 감시

  // 블로그 URL 상태가 변경될 때마다 실행되는 효과
  useEffect(() => {
    if (blog && blog.trim() !== "") { // 블로그 URL이 비어있지 않을 경우
      if (validateUrl(blog)) { // URL 유효성 검증
        setBlogError(null); // 에러 상태 초기화
        setBlogSuccess("유효한 URL입니다."); // 성공 메시지 설정
      } else {
        setBlogError("유효한 URL을 입력하세요."); // 에러 메시지 설정
        setBlogSuccess(null); // 성공 상태 초기화
      }
    } else {
      setBlogError(null); // 블로그 필드가 비어있으면 에러 상태 초기화
      setBlogSuccess(null); // 성공 상태 초기화
    }
  }, [blog, validateUrl, setBlogError, setBlogSuccess]); // 의존성 배열에 관련된 변수를 추가

  return (
    <div className="s:mt-4 mt-9">
      <label className="block text-sm ml-5 font-medium text-[#bebec1]">포트폴리오 URL (선택사항)</label>
      <input
        type="text" 
        placeholder="yourLink.com" 
        {...register("blog")}
        className="block focus:outline-primaryHeavy s:w-[300px] w-[350px] s:mt-1 mt-3 ml-5 h-[50px] p-2 bg-background rounded-md border-2 border-fillLight"
      />
      <p className="text-xs text-gray-500 ml-5 mt-2">Blog / Github / Notion / Tistory / Velog / Figma / Etc</p>
      {blogError && <p className="text-xs text-red-500 s:mt-1 mt-1 ml-5">{blogError}</p>} {/* 에러 메시지 표시 */}
      {blogSuccess && <p className="text-xs text-green-500 s:mt-1 mt-1 ml-5">{blogSuccess}</p>} {/* 성공 메시지 표시 */}
    </div>
  );
};

export default BlogInput;