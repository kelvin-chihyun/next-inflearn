"use client";

import DropBoxImageList from "components/DropBoxImageList";
import FileDragDropZone from "components/FileDragDropZone";
import Logo from "components/Logo";
import SearchComponent from "components/Search";
import { useState } from "react";
import { SonnerToaster } from "@next-inflearn/ui";
export default function Ui() {
  const [searchInput, setSearchInput] = useState<string>("");

  return (
    <main className="w-full p-2 flex flex-col gap-4">
      {/* Logo */}
      <Logo />

      {/* Search Component */}
      <SearchComponent
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      {/* File Drag&Drop Zone */}
      <FileDragDropZone />

      {/* Dropbox Image List */}
      <DropBoxImageList searchInput={searchInput} />

      {/* Toaster */}
      <SonnerToaster />
    </main>
  );
}
