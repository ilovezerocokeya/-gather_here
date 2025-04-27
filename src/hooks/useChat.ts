"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { supabase } from "@/utils/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { MessageRow } from "@/types/chats/Chats.type";

const CHANNEL_ID = "214322ba-1cbd-424c-9ef1-e4b281f71675";

const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const chatContentDivRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const debouncedInputValue = useDebounce(inputValue, 300);

  // 전체 메시지 불러오기 + 실시간 구독
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("Messages")
        .select(`*, Users (nickname, profile_image_url)`)
        .order("sent_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }
      setMessages(data as MessageRow[]);

      // 스크롤 아래로 이동
      if (chatContentDivRef.current) {
        requestAnimationFrame(() => {
          chatContentDivRef.current!.scrollTop = chatContentDivRef.current!.scrollHeight;
        });
      }
    };

    void fetchMessages();

    // Supabase 채널을 통한 실시간 메시지 업데이트 구독
    const subscription = supabase
      .channel("openTalk")
      .on("postgres_changes", { event: "*", schema: "public", table: "Messages" }, () => {
        void fetchMessages();
      })
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  // 디바운스된 입력값이 변할 때 서버에 메시지 전송
  useEffect(() => {
    const sendMessage = async () => {
      if (!debouncedInputValue.trim() || !user) return;

      const { error } = await supabase
        .from("Messages")
        .insert({
          channel_id: CHANNEL_ID,
          user_id: user.id,
          content: debouncedInputValue,
        })
        .select("*");

      if (error) {
        console.error("메시지 전송 에러:", error);
        return;
      }

      setInputValue(""); // 전송 완료 후 입력창 초기화
    };

    void sendMessage();
  }, [debouncedInputValue, user]);

  // 수동 제출 (버튼 클릭 or 폼 제출)
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!user || !inputValue.trim()) return;

    const { error } = await supabase
      .from("Messages")
      .insert({
        channel_id: CHANNEL_ID,
        user_id: user.id,
        content: inputValue,
      })
      .select("*");

    if (error) {
      console.error("메시지 전송 에러:", error);
      return;
    }

    setInputValue(""); // 수동 전송 후 입력창 초기화
  };

  // Enter 키 입력 처리
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        setInputValue(inputValue); // 엔터 입력 시 디바운스 대기열에 반영
      }
    }
  };

  // 메시지 삭제 기능
  const handleDelete = async (messageId: string) => {
    const { error } = await supabase.from("Messages").delete().eq("message_id", messageId);

    if (error) {
      console.error("메시지 삭제 에러:", error);
    }
  };

  return {
    user,
    messages,
    inputValue,
    setInputValue,
    isModalOpen,
    setIsModalOpen,
    chatContentDivRef,
    formRef,
    handleSubmit,
    handleEnterKeyDown,
    handleDelete,
  };
};

export default useChat;