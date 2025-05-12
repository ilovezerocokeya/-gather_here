import { useEffect, useState } from "react";
import { doubleCheckNickname } from "@/components/MyPage/MyInfo/actions/doubleCheckNickname";
import { useDebounce } from "@/hooks/useDebounce";

const useCheckNickname = (nickname: string | undefined) => {
  const [result, setResult] = useState<null | { valid: boolean; message: string }>(null);
  const isEmpty = (nickname ?? "").trim() === "";
  const debouncedNickname = useDebounce(nickname, 300);

  useEffect(() => {
    if (isEmpty) {
      setResult(null); // 빈 값일 경우 초기화
      return;
    }

    // 서버 중복 검사 실행
    const checkNickname = async () => {
      const res = await doubleCheckNickname(debouncedNickname!);
      setResult(res);
    };

    void checkNickname();
  }, [debouncedNickname, isEmpty]);

  return { result, isEmpty };
};

export default useCheckNickname;