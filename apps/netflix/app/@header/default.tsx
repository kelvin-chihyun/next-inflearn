"use client";

import { searchState } from "@/utils/jotai/atoms";
import Logo from "./Logo";
import { ShadSearch } from "@next-inflearn/ui";
import { useAtom } from "jotai";

export default function Header() {
  const [search, setSearch] = useAtom(searchState);
  return (
    <header className="fixed top-0 left-0 right-0 px-4 py-2 bg-gray-900 flex items-center justify-between z-50">
      <nav className="flex gap-4">
        <Logo />
        <ul className="flex gap-2 text-white">
          <li>Movies</li>
          <li>Dramas</li>
        </ul>
      </nav>

      <div className="flex w-full max-w-72 gap-2 items-center border border-white bg-transparent text-white rounded-md p-2">
        <ShadSearch
          className="bg-transparent"
          placeholder="Search Movies"
          value={search.default}
          onChange={(e) => setSearch({ ...search, default: e.target.value })}
        />
      </div>
    </header>
  );
}
