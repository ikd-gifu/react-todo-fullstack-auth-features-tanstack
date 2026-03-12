import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTodoById } from "../../apis/todoCrud";
import { TodoType } from "../../types/Todo";

export const useTodoDetailTemplate = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState<TodoType | null>(null);

  const fetchTodo = useCallback(async () => {
    const todoId = Number(id);
    if (!id || Number.isNaN(todoId)) {
      return;
    }

    const res = await getTodoById({ id: todoId }); // Promiseを返す非同期関数なのでawaitで待つ
    if (!res.data) {
      return;
    }

    setTodo(res.data);
  }, [id]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  return {
    todo,
  };
};
