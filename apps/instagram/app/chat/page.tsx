import { ChatPeopleList } from "@/views/chat";
import { ChatScreen } from "@/views/chat";
import { createServerSupabaseClient } from "@next-inflearn/supabase";

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <div className="w-full h-screen flex items-center">
      <ChatPeopleList loggedInUser={session?.user} />
      <ChatScreen />
    </div>
  );
}
