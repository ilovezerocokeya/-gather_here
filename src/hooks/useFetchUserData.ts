import { useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { UserData, defaultUserData } from "@/types/userData";

export const useFetchUserData = () => {
  // 유저 데이터를 저장하는 상태
  const [userData, setUserData] = useState<UserData | null>(null);

  // API 요청이 진행 중인지 나타내는 로딩 상태
  const [loading, setLoading] = useState<boolean>(false);

  // API 요청 중 발생한 에러 메시지를 저장하는 상태
  const [error, setError] = useState<string | null>(null);

  // 사용자 데이터를 가져오는 함수
  const fetchUserData = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Supabase에서 userId에 해당하는 사용자 데이터 조회
      const { data, error } = await supabase
        .from("Users") 
        .select("*")  
        .eq("user_id", userId)
        .single(); 

      if (error || !data) {
        throw new Error(error?.message || "사용자 데이터를 가져오는 데 실패했습니다.");
      }
      
      // data를 UserData 타입으로 안전하게 캐스팅
      const userData = data as UserData;

      // defaultUserData에 존재하는 키만 유지하면서 data의 값을 채움
      const formattedData: UserData = (Object.entries(defaultUserData) as [keyof UserData, UserData[keyof UserData]][]).reduce(
        (acc, [key, defaultValue]) => {
          return {
            ...acc,
            [key]: userData[key] ?? defaultValue,
          };
        },
        {} as UserData
      );

      setUserData(formattedData); // 가져온 데이터를 상태에 저장
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      
      // 오류 발생 시 기본값을 상태에 저장
      setUserData(defaultUserData);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    userData,   // 현재 저장된 유저 데이터
    fetchUserData,  // 유저 데이터를 가져오는 함수
    loading,  // API 요청 중인지 여부 (로딩 상태)
    error,  // 오류 메시지 상태
    setUserData  // 외부에서 직접 유저 데이터를 업데이트할 수 있도록 제공
  };
};