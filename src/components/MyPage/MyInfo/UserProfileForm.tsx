import { createServerSupabaseClient } from "@/utils/supabase/server";
import UserProfileClientForm from "./UserProfileClientForm";

export default async function UserProfileForm() {
  const supabase = createServerSupabaseClient();

  // 인증된 유저 정보 가져오기
  const { data: { user } } = await supabase.auth.getUser();

  // 유저 상세 정보 가져오기
  const { data: userData, error } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  if (error || !userData) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <UserProfileClientForm
      initialData={{
        email: userData.email ?? "",
        profileImageUrl: userData.profile_image_url ?? "",
        nickname: userData.nickname ?? "",
        jobTitle: userData.job_title ?? "",
        experience: userData.experience ?? "",
      }}
    />
  );
}