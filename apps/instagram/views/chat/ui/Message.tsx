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
      className={`max-w-[70%] ${isFromMe ? "ml-auto" : "mr-auto"} mb-2`}
    >
      <div
        className={`w-fit p-3 rounded-lg shadow-sm ${
          isFromMe
            ? "bg-light-blue-600 text-white rounded-tr-none ml-auto"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="break-words text-sm">{message}</p>
      </div>
      <div 
        className={`text-xs text-gray-500 mt-1 ${isFromMe ? "text-right" : "text-left"}`}
      >
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
