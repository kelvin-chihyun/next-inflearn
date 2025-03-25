"use client";

import { Person } from "./Person";
import { useAtom } from "jotai";
import { selectedUserIdState, selectedUserIndexState } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/actions/chartActions";
import { createBrowserSupabaseClient, User } from "@next-inflearn/supabase";

export function ChatPeopleList({ loggedInUser }: { loggedInUser?: User }) {
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useAtom(
    selectedUserIndexState
  );
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
  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
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
          onlineAt={new Date().toISOString()}
          userId={user.id}
        />
      ))}
    </div>
  );
}
