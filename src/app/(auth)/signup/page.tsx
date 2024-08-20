"use client";

import { useModal } from "@/provider/ContextProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SignupForm from "@/components/Signup/SigupForm";

const supabase = createClient();

const SignupPage = () => {
  const { openModal } = useModal();
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching logged-in user:", userError);
        return;
      }

      if (!user) {
        router.push("/");
        return;
      }

      if (!modalOpened) {
        openModal(<SignupForm />, true);
        setModalOpened(true);
      }
    };

    checkUser();
  }, [openModal, router, modalOpened]);

  return null;
};

export default SignupPage;
