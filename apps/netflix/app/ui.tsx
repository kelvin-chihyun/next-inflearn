"use client";

import { SonnerToaster } from "@next-inflearn/ui";
import MovieCardList from "../components/MovieCardList";

export default function UI() {
  return (
    <>
      <main className="mt-16">
        <MovieCardList />
      </main>
      <SonnerToaster />
    </>
  );
}
