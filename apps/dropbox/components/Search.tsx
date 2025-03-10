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
    <div className="relative">
      <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <ShadInput
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search Images"
        type="search"
        className="pl-8"
      />
    </div>
  );
}
