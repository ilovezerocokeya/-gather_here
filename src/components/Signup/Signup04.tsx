"use client";

import { useRouter } from "next/navigation";
import { useModal } from "@/provider/ContextProvider";
import Image from "next/image";

const Signup04: React.FC = () => {
  const router = useRouter();
  const { closeModal } = useModal();


  // "둘러보기" 버튼 클릭 시 홈으로 이동
  const handleExplore = () => {
    closeModal(); // 모달 닫기 (혹시 열려있을 수 있으므로 방어)
    router.replace("/"); // 홈으로 리디렉션
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" style={{ marginTop: '-30px' }}>
      <div className="...">
        {/* 환영 이미지 */}
        <div className="...">
          <Image
            src="/logos/welcome.webp"
            alt="Welcome Image"
            width={350}
            height={350}
            className="object-contain s:w-[300px] s:h-[300px]"
          />
        </div>

        {/* 환영 메시지 */}
        <div className="text-center s:mt-6 mt-10">
          <div className="text-2xl font-medium text-white">함께할 준비 되셨나요?</div>
          <div className="text-[#9a9a9a] mt-5 text-m">
            나를 알리고, 팀을 만나보는 여정
            <br />
            지금부터 <span className="text-primary">@gather_here</span>에서 시작해요.
          </div>
        </div>

        {/* 둘러보기 버튼 */}
        <div className="s:bottom-8 bottom-9 w-full px-4 mt-10 flex justify-center">
          <button
            onClick={handleExplore}
            className={`
              s:w-[300px] w-[350px] h-[45px]
              bg-[#343437] text-primary
              py-2 rounded-xl
              transition duration-300 ease-in-out transform
              hover:bg-[#4a4a4e] hover:text-white hover:scale-105
              active:scale-95 active:bg-[#2d2d2f]
              shadow-md hover:shadow-lg
            `}
          >
            둘러보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup04;