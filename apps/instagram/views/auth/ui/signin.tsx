"use client";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { ShadButton, ShadInput } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function SignIn({ setView }: { setView: (view: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createBrowserSupabaseClient();

  const signInMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data) {
        console.log(data);
      }

      if (error) {
        alert(error.message);
      }
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
        <img src={"/images/inflearngram.png"} className="w-60 mb-6" />
        <ShadInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-sm"
          placeholder="이메일을 입력해주세요."
        />
        <ShadInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full rounded-sm"
          placeholder="비밀번호를 입력해주세요."
        />
        <ShadButton
          onClick={() => {
            signInMutation.mutate();
          }}
          color="light-blue"
          className="w-full text-md py-1"
        >
          로그인
        </ShadButton>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        아직 계정이 없으신가요?{" "}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView("SIGNIN")}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
