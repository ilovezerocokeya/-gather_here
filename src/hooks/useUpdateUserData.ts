import { UserData } from "@/types/userData";
import { supabase } from "@/utils/supabase/client"; 

//유저 데이터를 업데이트하는 커스텀 훅
export const useUpdateUserData = (
  userData: UserData | null,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) => {

  // 특정 필드(answers)만 업데이트하는 함수
  const updateUserAnswers = async (answers: Partial<UserData>) => {
    //  유저 데이터가 없거나, user_id가 없는 경우 업데이트 불가능
    if (!userData?.user_id) return;
    
    // 업데이트할 필드가 없는 경우 불필요한 요청 방지
    if (Object.keys(answers).length === 0) return; 
  
    try {
      // user_id가 일치하는 사용자 데이터 업데이트
      const { error } = await supabase
        .from("Users")
        .update(answers)
        .eq("user_id", userData.user_id); // 특정 user_id에 해당하는 데이터만 업데이트

      // 오류 발생 시 예외 처리
      if (error) {
        throw new Error(error.message || "서버에서 에러가 발생했습니다.");
      }

      // 성공적으로 업데이트된 경우, 상태 업데이트
      setUserData((prev) => ({
        ...prev!,
        ...answers,
      }));

    } catch (err: unknown) {
      // 오류 발생 시 콘솔에 로그 출력
      console.error("Error updating user data:", err);
    }
  };

  return { updateUserAnswers }; // 업데이트 함수를 반환하여 외부에서 사용할 수 있도록 제공
};