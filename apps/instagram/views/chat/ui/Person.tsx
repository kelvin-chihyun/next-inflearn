"use client";

import { getRandomImage } from "@/shared/utils";
import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";
import Image from "next/image";
import { Card, CardContent } from "@next-inflearn/ui";

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo("ko-KR");

interface PersonProps {
  index: number;
  userId: string;
  name: string;
  onlineAt?: string;
  isActive?: boolean;
  onChatScreen?: boolean;
  onClick?: () => void;
}

export function Person({
  index,
  name,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick = () => {},
}: PersonProps) {
  return (
    <Card
      className={`p-0 rounded-none border-0 border-b border-gray-100 shadow-none
        ${!!onClick && "cursor-pointer hover:bg-gray-50 transition-colors"} 
        ${!onChatScreen && isActive ? "bg-light-blue-50" : ""} 
        ${onChatScreen ? "border-b border-gray-200 shadow-sm sticky top-0 z-10 bg-white" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex w-full gap-4 items-center">
        <div className="relative">
          <Image
            src={getRandomImage(index)}
            alt={name}
            className="rounded-full object-cover border border-gray-200"
            width={48}
            height={48}
          />
          {onlineAt && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold text-base truncate">
            {name}
          </p>
          <p className="text-gray-500 text-xs">
            {onlineAt ? (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                {timeAgo.format(Date.parse(onlineAt))}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                Offline
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
