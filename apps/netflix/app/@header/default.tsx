"use client";

import { searchState, loginModalAtom, userAtom } from "@/utils/jotai/atoms";
import Logo from "./Logo";
import {
  ShadButton,
  ShadSearch,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@next-inflearn/ui";
import { useAtom, useAtomValue } from "jotai";
import { PersonStanding, LogOut } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import { createBrowserSupabaseClient } from "@next-inflearn/supabase";
import { useEffect, useState } from "react";

export default function Header() {
  const [search, setSearch] = useAtom(searchState);
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(loginModalAtom);
  const user = useAtomValue(userAtom);
  const supabase = createBrowserSupabaseClient();
  const [nickname, setNickname] = useState("");

  // 사용자 정보가 있을 때 프로필 정보 가져오기
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (data) {
          setNickname(data.nickname);
        }
      };

      fetchProfile();
    }
  }, [user, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 px-4 py-2 bg-gray-900 flex items-center justify-between z-50">
        <nav className="flex gap-4">
          <Logo />
          <ul className="flex gap-2 text-white">
            <li>Movies</li>
            <li>Dramas</li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex w-full max-w-72 gap-2 items-center border border-white bg-transparent text-white rounded-md p-2">
            <ShadSearch
              className="bg-transparent"
              placeholder="Search Movies"
              value={search.default}
              onChange={(e) =>
                setSearch({ ...search, default: e.target.value })
              }
            />
          </div>

          {user ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="rounded-full p-2 hover:bg-white/10 transition-colors">
                  <PersonStanding className="w-6 h-6 text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48 bg-gray-900 border-gray-800">
                <div className="flex flex-col gap-2">
                  <div className="text-base font-medium text-white">
                    {nickname}
                  </div>
                  <div className="text-xs text-white/60">{user.email}</div>
                  <hr className="border-gray-800" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <ShadButton
              variant="outline"
              className="text-black border-white hover:bg-white/80"
              onClick={() => setIsLoginModalOpen(true)}
            >
              로그인
            </ShadButton>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
