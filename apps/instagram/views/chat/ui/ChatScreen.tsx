"use client";

import { Person } from "./Person";
import { Message } from "./Message";
import { useAtomValue } from "jotai";
import {
  selectedUserIndexState,
  selectedUserIdState,
  presenceState,
} from "@/shared/utils";
import { ShadButton, ShadInput, Spinner } from "@next-inflearn/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllMessages,
  getUserById,
  sendMessage,
} from "@/actions/chartActions";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";

export function ChatScreen() {
  const selectedUserIndex = useAtomValue(selectedUserIndexState);
  const selectedUserId = useAtomValue(selectedUserIdState);
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();
  const presence = useAtomValue(presenceState);

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId || ""),
    enabled: !!selectedUserId, // Only run the query if we have a selectedUserId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({
        message,
        chatUserId: selectedUserId || "",
      });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId || "" }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && !payload.errors) {
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (!selectedUserId) return <div className="w-full"></div>;

  return selectedUserIndex !== null ? (
    <div className="h-screen flex flex-col flex-1 w-full bg-white items-stretch">
      {/* Active user area */}
      <Person
        index={Number(selectedUserIndex)}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0] as string}
        onChatScreen={true}
        onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt}
        userId={selectedUserQuery.data?.id as string}
      />

      {/* Chat messages area */}
      <div className="w-full overflow-y-auto flex-1 flex flex-col p-4 gap-3 bg-gray-50">
        {getAllMessagesQuery.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="text-light-blue-600 h-8 w-8" />
          </div>
        ) : getAllMessagesQuery.data?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <>
            {getAllMessagesQuery.data?.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                isFromMe={message.receiver === selectedUserId}
              />
            ))}
          </>
        )}
      </div>

      {/* Message input area */}
      <div className="flex w-full p-3 border-t border-gray-200 bg-white">
        <ShadInput
          className="p-3 w-full border border-gray-300 rounded-l-md focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              sendMessageMutation.mutate();
            }
          }}
        />

        <ShadButton
          className="min-w-24 p-3 bg-light-blue-600 hover:bg-light-blue-700 text-white rounded-r-md transition-colors"
          color="light-blue"
          variant="default"
          onClick={() => message.trim() !== "" && sendMessageMutation.mutate()}
          disabled={message.trim() === "" || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <span>Send</span>
          )}
        </ShadButton>
      </div>
    </div>
  ) : (
    <div className="flex-1 w-full flex items-center justify-center bg-gray-50 h-screen">
      <div className="text-center p-8 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Your Messages
        </h3>
        <p className="text-gray-600 mb-6">
          Select a chat or start a new conversation
        </p>
      </div>
    </div>
  );
}
