"use client";

import { Button, Input } from "@next-inflearn/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTodo, getTodos } from "actions/todo-actions";
import Todo from "components/Todo";
import { useState } from "react";

export default function UI() {
  const [searchInput, setSearchInput] = useState("");

  const todosQuery = useQuery({
    queryKey: ["todos", searchInput],
    queryFn: () => getTodos({ searchInput }),
  });

  const createTodoMutation = useMutation({
    mutationFn: () =>
      createTodo({
        title: "New Todo",
        completed: false,
      }),
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  return (
    <div className="max-w-2xl w-full mx-auto h-full min-h-screen bg-white border-x border-gray-200 shadow-md">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">TODO LIST</h1>

        <div className="mb-6 relative h-14">
          <Input
            label="Search TODO"
            placeholder="Search TODO"
            className="border-blue-100 rounded-full focus:border-blue-500 focus:border-2 px-14 h-full text-lg"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-0 h-full",
            }}
            icon={
              <div className="absolute left-5 translate-y-2/3 w-6 h-6 flex items-center justify-center">
                <i className="fas fa-search text-black text-2xl" />
              </div>
            }
            value={searchInput}
            crossOrigin={undefined}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="space-y-3 mb-8">
          {todosQuery.isPending && (
            <p className="text-center text-gray-500">Loading...</p>
          )}
          {todosQuery.data &&
            todosQuery.data.map((todo) => <Todo key={todo.id} todo={todo} />)}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => createTodoMutation.mutate()}
            loading={createTodoMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
            size="lg"
          >
            <i className="fas fa-plus text-xl" />
            ADD TODO
          </Button>
        </div>
      </div>
    </div>
  );
}
