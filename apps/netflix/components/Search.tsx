"use client";

import { ShadSearch } from "@next-inflearn/ui";

export default function Search({
  searchInput,
  setSearchInput,
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
}) {
  return (
    <ShadSearch
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="border-white"
    />
  );
}
