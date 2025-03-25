"use client";

import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { Button } from "@next-inflearn/ui";

export function LogoutButton() {
  const supabase = createBrowserSupabaseClient();

  return (
    <Button
      onClick={async () => {
        supabase.auth.signOut();
      }}
      color="red"
    >
      로그아웃
    </Button>
  );
}
