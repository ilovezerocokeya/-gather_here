"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Common/Toast/Toast";
import { useUser } from "@/provider/UserContextProvider";

const TeamworkQuestions: React.FC = () => {
  const supabase = createClient();
  const { user, fetchUserData } = useUser();
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [toastState, setToastState] = useState({ state: "", message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setToastState({ state: "error", message: "사용자 정보가 없습니다." });
      return;
    }

    const { error } = await supabase
      .from("Users")
      .update({
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
      })
      .eq("user_id", user.id);

    if (error) {
      setToastState({ state: "error", message: "저장에 실패했습니다." });
    } else {
      setToastState({ state: "success", message: "저장되었습니다." });
      fetchUserData();
    }
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <fieldset className="p-6 s:p-0">
          <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">팀워크 관련 질문</h1>

          {/* 질문 1 */}
          <div>
            <label htmlFor="answer1" className="block text-sm font-medium text-labelNormal mb-1">
              Q1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.
            </label>
            <textarea
              id="answer1"
              name="answer1"
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>

          {/* 질문 2 */}
          <div>
            <label htmlFor="answer2" className="block text-sm font-medium text-labelNormal mb-1">
              Q2. 팀과 함께 목표를 이루기 위해 가장 중요하다고 생각하는 점은 무엇인가요?
            </label>
            <textarea
              id="answer2"
              name="answer2"
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>

          {/* 질문 3 */}
          <div>
            <label htmlFor="answer3" className="block text-sm font-medium text-labelNormal mb-1">
              Q3. 자신이 부족하다고 느낀 부분을 어떻게 보완하고 학습하는지 이야기해주세요.
            </label>
            <textarea
              id="answer3"
              name="answer3"
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>

          <div className="mt-6 mb-12">
            <div className="s:fixed flex s:justify-center s:bottom-0 s:left-0 s:right-0 s:p-4 s:bg-background s:z-10">
              <div className="flex justify-end s:justify-center gap-2 w-full s:max-w-container-s">
                <button type="submit" aria-label="답변 저장" className="shared-button-green w-[65px] s:w-1/2">
                  저장
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
      {toastState.state && (
        <Toast
          state={toastState.state}
          message={toastState.message}
          onClear={() => setToastState({ state: "", message: "" })}
        />
      )}
    </section>
  );
};

export default TeamworkQuestions;
