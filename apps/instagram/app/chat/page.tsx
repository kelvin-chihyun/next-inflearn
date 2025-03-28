import { ChatPeopleList } from "@/views/chat";
import { ChatScreen } from "@/views/chat";
import { createServerSupabaseClient } from "@next-inflearn/supabase";

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <div className="w-[calc(100vw-73px)] h-screen grid grid-cols-[280px_1fr] overflow-hidden border-t border-gray-200 shadow-md">
      <ChatPeopleList loggedInUser={session?.user} />
      <ChatScreen />
    </div>
  );
}
