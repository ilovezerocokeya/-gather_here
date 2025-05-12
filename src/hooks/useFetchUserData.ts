import { useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { UserData, defaultUserData } from "@/types/userData";

export const useFetchUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
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
      
      const userData = data as UserData; // data를 UserData 타입으로 안전하게 캐스팅

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