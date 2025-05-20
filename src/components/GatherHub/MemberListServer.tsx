import MemberCardServer from "./MemberCardServer";
import { MemberType } from "@/lib/gatherHub";

interface MemberListServerProps {
  members: MemberType[];
}

const MemberListServer = ({ members }: MemberListServerProps) => {

  if (members.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-12 text-base font-medium">
        선택한 직군에 해당하는 유저가 없습니다.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-10 md:gap-20 lg:gap-28 place-items-center">
      {members.map((member) => (
        <MemberCardServer key={member.user_id} {...member} liked={false} />
      ))}
    </div>
  );
};

export default MemberListServer;