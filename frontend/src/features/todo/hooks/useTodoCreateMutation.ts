import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../apis/todoCrud";
import { CreateTodoRequest } from "../types/Todo";

// useMutation は命令的 作成、更新、削除など
export const useTodoCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTodoRequest) => createTodo(request),
    onSuccess: () => {
      // 更新後のTodosを再取得する
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};
