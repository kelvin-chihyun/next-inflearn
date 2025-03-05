"use client";

import { Checkbox, IconButton, Spinner } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo, TodoRow } from "actions/todo-actions";
import { queryClient } from "config/ReactQueryClientProvider";
import { useState } from "react";

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
    <div className="w-full flex items-center gap-1">
      <Checkbox
        checked={completed}
        crossOrigin={undefined}
        onChange={(e) => {
          setCompleted(e.target.checked);
          updateTodoMutation.mutate();
        }}
      />

      {isEditing ? (
        <input
          className="flex-1 border-b-black border-b pb-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p className={`flex-1 ${completed && "line-through"}`}>{title}</p>
      )}

      {isEditing ? (
        <IconButton
          onClick={() => {
            updateTodoMutation.mutate();
          }}
        >
          {updateTodoMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-check" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className="fas fa-pen" />
        </IconButton>
      )}
      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
