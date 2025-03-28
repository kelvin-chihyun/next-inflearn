"use client";

import { Person } from "./Person";
import { useAtom } from "jotai";
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/actions/chartActions";
import { createBrowserSupabaseClient, User } from "@next-inflearn/supabase";
import { useEffect } from "react";

// Helper function to safely get the onlineAt value from presence data
function getOnlineAt(
  presence: Record<string, any[]> | null,
  userId: string
): string | undefined {
  if (!presence) return undefined;
  if (!(userId in presence)) return undefined;

  const userPresence = presence[userId];
  if (!Array.isArray(userPresence) || userPresence.length === 0)
    return undefined;

  return userPresence[0]?.onlineAt;
}

export function ChatPeopleList({ loggedInUser }: { loggedInUser?: User }) {
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useAtom(
    selectedUserIndexState
  );
  const [presence, setPresence] = useAtom(presenceState);
  const supabase = createBrowserSupabaseClient();

  // getAllUsers
  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log(allUsers);
      return allUsers.filter((user) => user.id !== loggedInUser?.id);
    },
  });

  useEffect(() => {
    if (!loggedInUser?.id) return;

    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: loggedInUser.id,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      const newStateObj = JSON.parse(JSON.stringify(newState));
      setPresence(newStateObj);
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(),
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [loggedInUser?.id, supabase, setPresence]);

  return (
    <div className="h-screen w-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b w-full border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>

      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent w-full">
        {getAllUsersQuery.data?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
            No users available
          </div>
        ) : (
          getAllUsersQuery.data?.map((user, index) => (
            <Person
              key={user.id}
              onClick={() => {
                setSelectedUserId(user.id);
                setSelectedUserIndex(index.toString());
              }}
              index={index}
              isActive={selectedUserId === user.id}
              name={user.email?.split("@")[0] || "User"}
              onChatScreen={false}
              onlineAt={getOnlineAt(presence, user.id)}
              userId={user.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
