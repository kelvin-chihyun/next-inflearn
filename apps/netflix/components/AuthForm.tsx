"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { ShadButton, ShadInput } from "@next-inflearn/ui";
import { toast } from "sonner";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // 유효성 검사 상태
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const supabase = createBrowserSupabaseClient();

  // 이메일 중복 체크
  useEffect(() => {
    if (mode === "signup" && email && email.includes("@")) {
      const checkEmailDuplicate = async () => {
        setIsCheckingEmail(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          setIsEmailValid(!data);
        } catch (error) {
          console.error("이메일 중복 확인 중 오류:", error);
        } finally {
          setIsCheckingEmail(false);
        }
      };

      const timer = setTimeout(checkEmailDuplicate, 500);
      return () => clearTimeout(timer);
    }
  }, [email, mode, supabase]);

  // 닉네임 중복 체크
  useEffect(() => {
    if (mode === "signup" && nickname && nickname.length >= 2) {
      const checkNicknameDuplicate = async () => {
        setIsCheckingNickname(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("nickname", nickname)
            .maybeSingle();

          setIsNicknameValid(!data);
        } catch (error) {
          console.error("닉네임 중복 확인 중 오류:", error);
        } finally {
          setIsCheckingNickname(false);
        }
      };

      const timer = setTimeout(checkNicknameDuplicate, 500);
      return () => clearTimeout(timer);
    }
  }, [nickname, mode, supabase]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // 회원가입 시 유효성 검사
    if (mode === "signup") {
      if (!isEmailValid) {
        toast.error("이미 사용 중인 이메일입니다.");
        return;
      }
      if (!isNicknameValid) {
        toast.error("이미 사용 중인 닉네임입니다.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname,
            },
          },
        });

        if (error) throw error;

        // 프로필 직접 생성 (트리거가 작동하지 않을 경우를 대비)
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email,
                nickname,
              },
            ]);

          if (profileError) {
            console.error("프로필 생성 중 오류:", profileError);
          }
        }

        toast.success("회원가입이 완료되었습니다.");
        onSuccess?.();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("로그인되었습니다.");
        onSuccess?.();
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="flex flex-col gap-4">
      <div>
        <ShadInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={mode === "signup" && !isEmailValid ? "border-red-500" : ""}
        />
        {mode === "signup" && email && !isEmailValid && (
          <p className="text-red-500 text-xs mt-1">
            이미 사용 중인 이메일입니다.
          </p>
        )}
        {isCheckingEmail && (
          <p className="text-gray-400 text-xs mt-1">이메일 확인 중...</p>
        )}
      </div>

      {mode === "signup" && (
        <div>
          <ShadInput
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            className={!isNicknameValid ? "border-red-500" : ""}
          />
          {nickname && !isNicknameValid && (
            <p className="text-red-500 text-xs mt-1">
              이미 사용 중인 닉네임입니다.
            </p>
          )}
          {isCheckingNickname && (
            <p className="text-gray-400 text-xs mt-1">닉네임 확인 중...</p>
          )}
        </div>
      )}

      <ShadInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      <ShadButton
        type="submit"
        disabled={
          isLoading ||
          (mode === "signup" && (!isEmailValid || !isNicknameValid))
        }
      >
        {mode === "signin" ? "로그인" : "회원가입"}
      </ShadButton>

      <ShadButton
        type="button"
        variant="outline"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setNickname("");
          setIsEmailValid(true);
          setIsNicknameValid(true);
        }}
      >
        {mode === "signin" ? "회원가입으로 전환" : "로그인으로 전환"}
      </ShadButton>
    </form>
  );
}
