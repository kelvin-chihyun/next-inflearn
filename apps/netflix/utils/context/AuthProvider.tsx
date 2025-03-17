"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { useSetAtom } from "jotai";
import { userAtom } from "@/utils/jotai/atoms";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom);
  const supabase = createBrowserSupabaseClient();

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
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  return children;
}
