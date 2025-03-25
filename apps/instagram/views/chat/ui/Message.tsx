"use client";

export function Message({
  isFromMe,
  message,
}: {
  isFromMe: boolean;
  message: string;
}) {
  return (
    <div
      className={`w-fit p-3 rounded-md ${
        isFromMe
          ? "ml-auto bg-light-blue-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
