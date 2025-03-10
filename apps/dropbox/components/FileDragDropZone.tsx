"use client";

import { ShadButton } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { queryClient } from "@next-inflearn/ui/lib";
import { useRef } from "react";

export default function FileDragDropZone() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadImageMutation.mutate(formData);
          console.log(result);
        }
      }}
      className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center"
    >
      <input ref={fileRef} type="file" className="" />
      <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
      <ShadButton disabled={uploadImageMutation.isPending} type="submit">
        {uploadImageMutation.isPending ? "업로드 중..." : "파일 업로드"}
      </ShadButton>
    </form>
  );
}
