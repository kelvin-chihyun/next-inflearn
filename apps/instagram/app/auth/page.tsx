"use client";

import { useState } from "react";
import { SignUp, SignIn } from "@/views/auth";

export default function Auth() {
  const [view, setView] = useState("SIGNUP");

  return (
    <main className="h-screen w-[calc(100vw - 73px)] ml-[73px] flex justify-center items-center bg-gradient-to-br from-purple-50 to-light-blue-50">
      {view === "SIGNUP" ? (
        <SignUp setView={setView} />
      ) : (
        <SignIn setView={setView} />
      )}
    </main>
  );
}
