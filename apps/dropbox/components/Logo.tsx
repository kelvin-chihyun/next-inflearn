"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <Image
        src="/images/dropbox_icon.png"
        alt="Mini Dropbox Logo"
        width={50}
        height={30}
        className="!w-8 !h-auto"
      />
      <span className="text-xl font-bold">Minibox</span>
    </div>
  );
}
