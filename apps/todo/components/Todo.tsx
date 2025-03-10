"use client";

import { Checkbox, IconButton, Spinner } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo, TodoRow } from "actions/todo-actions";
import { queryClient } from "@next-inflearn/ui/lib";
import { useState } from "react";

// 날짜 포맷팅 함수
function formatDate(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // YYYY. MM. DD. HH:mm:ss 형식을 YYYY/MM/DD HH:mm:ss 형식으로 변환
  return formattedDate
    .replace(/\. /g, "/") // '. ' -> '/'
    .replace(/\.$/, "") // 마지막 '.' 제거
    .replace(/(\d{4}\/\d{2}\/\d{2})\//, "$1 "); // 날짜와 시간 사이의 '/'를 공백으로 변경
}

export default function Todo({ todo }: { todo: TodoRow }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);

  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title,
        completed,
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-blue/10 hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md">
      <Checkbox
        checked={completed}
        onChange={(e) => {
          setCompleted(e.target.checked);
          updateTodoMutation.mutate();
        }}
        className="h-5 w-5 checked:bg-blue-500 checked:border-blue-500"
        crossOrigin={undefined}
      />

      {isEditing ? (
        <input
          className="flex-1 px-2 py-1 border-b-2 border-blue-500 outline-none text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p
          className={`flex-1 text-lg ${completed && "line-through text-gray-400"}`}
        >
          {title}
        </p>
      )}

      {/* 날짜 정보와 버튼을 감싸는 컨테이너 */}
      <div className="flex items-center gap-4">
        {/* 날짜 정보 컨테이너 */}
        <div
          className={`flex flex-col text-sm text-gray-500 ${
            completed
              ? "items-end justify-between"
              : "items-center justify-center"
          }`}
        >
          <p className="whitespace-nowrap">
            Created: {formatDate(todo.created_at)}
          </p>
          {completed && todo.completed_at && (
            <p className="whitespace-nowrap text-blue-500">
              Completed: {formatDate(todo.completed_at)}
            </p>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <IconButton
              variant="text"
              className="rounded-full h-10 w-10 !p-0 hover:bg-blue-50"
              onClick={() => updateTodoMutation.mutate()}
            >
              {updateTodoMutation.isPending ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <i className="fas fa-check text-blue-500 text-lg" />
              )}
            </IconButton>
          ) : (
            <IconButton
              variant="text"
              className="rounded-full h-10 w-10 !p-0 hover:bg-blue-50"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-pen text-gray-600 text-lg" />
            </IconButton>
          )}
          <IconButton
            variant="text"
            className="rounded-full h-10 w-10 !p-0 hover:bg-red-50"
            onClick={() => deleteTodoMutation.mutate()}
          >
            {deleteTodoMutation.isPending ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <i className="fas fa-trash text-red-500 text-lg" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
