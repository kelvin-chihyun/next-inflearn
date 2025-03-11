"use client";

import { ShadInput } from "@next-inflearn/ui";

export default function SearchComponent({
  searchInput,
  setSearchInput,
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
}) {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <ShadInput
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="이미지 검색..."
        type="search"
        className="pl-10 pr-4 py-2 w-full bg-white/70 border border-slate-200 rounded-xl shadow-sm focus:border-blue-400 focus:ring-blue-400/30"
      />
    </div>
  );
}
