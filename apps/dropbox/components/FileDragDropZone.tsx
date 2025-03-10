"use client";

import { Input } from "@next-inflearn/ui";

export default function FileDragDropZone() {
  return (
    <section className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center">
      <Input type="file" className="" crossOrigin="anonymous" />
      <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
    </section>
  );
}
