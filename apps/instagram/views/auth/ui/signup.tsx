"use client";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { ShadButton, ShadInput } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";

export function SignUp({ setView }: { setView: (view: string) => void }) {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const supabase = createBrowserSupabaseClient();
  // signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: "signup",
        email,
        token: otp,
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
        <Image
          src={"/images/inflearngram.png"}
          className=" mb-6"
          alt="inflearngram"
          width={240}
          height={180}
        />
        {confirmationRequired ? (
          <ShadInput
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            className="w-full rounded-sm"
            placeholder="6자리 OTP를 입력해주세요."
          />
        ) : (
          <>
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
          </>
        )}
        <ShadButton
          onClick={() => {
            if (confirmationRequired) {
              verifyOtpMutation.mutate();
            } else {
              signupMutation.mutate();
            }
          }}
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          color="light-blue"
          className="w-full text-md py-1"
        >
          {confirmationRequired ? "인증하기" : "가입하기"}
        </ShadButton>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        이미 계정이 있으신가요?{" "}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView("SIGNIN")}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
