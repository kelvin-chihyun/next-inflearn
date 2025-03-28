"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { useSetAtom } from "jotai";
import { userAtom } from "@/shared/utils";
import { useRouter } from "next/navigation";

export function AuthProvider({
  accessToken,
  children,
}: {
  accessToken: string;
  children: React.ReactNode;
}) {
  const setUser = useSetAtom(userAtom);
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Auth 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  return children;
}
