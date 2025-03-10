"use client";

import { Input } from "@next-inflearn/ui";

export default function SearchComponent({
  searchInput,
  setSearchInput,
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
}) {
  return (
    <Input
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      label="Search Images"
      icon={<i className="fa-solid fa-magnifying-glass" />}
      crossOrigin="anonymous"
    />
  );
}
