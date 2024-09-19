import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const useCheckNickname = (nickname: string) => {
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkNicknameAvailability = async () => {
      const specialCharPattern = /[^a-zA-Z0-9가-힣_]/;

      if (
        !nickname ||
        typeof nickname !== "string" ||
        nickname.length < 2 ||
        nickname.length > 11 ||
        specialCharPattern.test(nickname)
      ) {
        setNicknameAvailable(null);
        return;
      }

      const { data, error } = await supabase.from("Users").select("nickname").eq("nickname", nickname);

      if (error) {
        console.error("Error checking nickname availability:", error);
        return;
      }

      setNicknameAvailable(data.length === 0);
    };

    checkNicknameAvailability();
  }, [nickname]);

  return nicknameAvailable;
};

export default useCheckNickname;
