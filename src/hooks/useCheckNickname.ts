import { useEffect, useState } from "react";
import { doubleCheckNickname } from "@/components/MyPage/MyInfo/actions/doubleCheckNickname";
import { useDebounce } from "@/hooks/useDebounce";


const useCheckNickname = (nickname: string | undefined) => {
  const [result, setResult] = useState<null | { valid: boolean; message: string }>(null);
  const isEmpty = (nickname ?? "").trim() === "";
  const debouncedNickname = useDebounce(nickname, 300);

  useEffect(() => {
    // 닉네임이 비어있으면 검사 초기화
    if (isEmpty) {
      setResult(null);
      return;
    }

    // 서버 액션을 통해 닉네임 검사 실행
    const checkNickname = async () => {
      const res = await doubleCheckNickname(debouncedNickname!); 
      setResult(res);
    };
    
    void checkNickname();
  }, [debouncedNickname, isEmpty]);

  return { result, isEmpty };
};

export default useCheckNickname;