"use client";

import { IconButton } from "@next-inflearn/ui";
import Image from "next/image";

export default function DropboxImage() {
  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
      {/* Image */}
      <div>
        <Image
          src="/images/cutedog.jpeg"
          alt="cutedog"
          width={100}
          height={100}
          className="w-full aspect-square rounded-2xl"
        />
      </div>

      {/* FileName */}
      <div className="">cutedog.jpeg</div>

      <div className="absolute top-4 right-4">
        <IconButton onClick={() => {}} color="red">
          <i className="fas fa-trash" />
        </IconButton>
      </div>
    </div>
  );
}
