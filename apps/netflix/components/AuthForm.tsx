"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { ShadButton, ShadInput } from "@next-inflearn/ui";
import { toast } from "sonner";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const supabase = createBrowserSupabaseClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname,
            },
          },
        });
        if (error) throw error;
        toast.success("가입 확인 이메일을 확인해주세요.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("로그인되었습니다.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="flex flex-col gap-4">
      <ShadInput
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {mode === "signup" && (
        <ShadInput
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          minLength={2}
          maxLength={20}
        />
      )}
      <ShadInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <ShadButton type="submit" disabled={isLoading}>
        {mode === "signin" ? "로그인" : "회원가입"}
      </ShadButton>
      <ShadButton
        type="button"
        variant="outline"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setNickname("");
        }}
      >
        {mode === "signin" ? "회원가입으로 전환" : "로그인으로 전환"}
      </ShadButton>
    </form>
  );
}
