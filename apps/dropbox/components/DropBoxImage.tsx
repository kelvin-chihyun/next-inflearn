"use client";

import { FileObject, getImageUrl } from "@next-inflearn/supabase";
import { IconButton } from "@next-inflearn/ui";
import Image from "next/image";

export default function DropboxImage({ image }: { image: FileObject }) {
  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
      {/* Image */}
      <div>
        <Image
          src={getImageUrl(image.name)}
          alt="cutedog"
          width={100}
          height={100}
          className="w-full aspect-square rounded-2xl"
        />
      </div>

      {/* FileName */}
      <div className="">{image.name}</div>

      <div className="absolute top-4 right-4">
        <IconButton onClick={() => {}} color="red">
          <i className="fas fa-trash" />
        </IconButton>
      </div>
    </div>
  );
}
