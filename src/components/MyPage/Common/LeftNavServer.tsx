import { createServerSupabaseClient } from "@/utils/supabase/server";
import LeftNavClient from "./LeftNavClient";
import type { UserData } from "@/types/userData";

const LeftNavServer = async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userData) return null;

  return <LeftNavClient userData={userData as UserData} />;
};

export default LeftNavServer;