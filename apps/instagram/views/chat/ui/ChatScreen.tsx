"use client";

import { Person } from "./Person";
import { Message } from "./Message";
import { useAtomValue } from "jotai";
import { selectedUserIndexState, selectedUserIdState } from "@/shared/utils";
import { ShadButton, ShadInput } from "@next-inflearn/ui";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/chartActions";
import { User } from "@next-inflearn/supabase";

export function ChatScreen() {
  const selectedUserIndex = useAtomValue(selectedUserIndexState);
  const selectedUserId = useAtomValue(selectedUserIdState);

  if (!selectedUserId) return null;

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });

  return selectedUserIndex !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* Active 유저 영역 */}
      <Person
        index={Number(selectedUserIndex)}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0] as string}
        onChatScreen={true}
        onlineAt={new Date().toISOString()}
        userId={selectedUserQuery.data?.id as string}
      />

      {/* 채팅 영역 */}
      <div className="w-full flex-1 flex flex-col p-4 gap-3">
        <Message isFromMe={true} message={"안녕하세요."} />
        <Message isFromMe={false} message={"반갑습니다."} />
        <Message isFromMe={true} message={"안녕하세요."} />
        <Message isFromMe={true} message={"안녕하세요."} />
        <Message isFromMe={false} message={"반갑습니다."} />
        <Message isFromMe={false} message={"반갑습니다."} />
      </div>

      {/* 채팅창 영역 */}
      <div className="flex">
        <ShadInput
          className="p-3 w-full border-2 border-light-blue-600"
          placeholder="메시지를 입력하세요."
        />

        <ShadButton
          className="min-w-20 p-3 bg-light-blue-600 text-white"
          color="light-blue"
          variant="default"
        >
          <span>전송</span>
        </ShadButton>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
