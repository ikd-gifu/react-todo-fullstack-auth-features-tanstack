import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "../apis/todoCrud";
import { UpdateTodoRequest } from "../types/Todo";

// useMutation は命令的 作成、更新、削除など
export const useTodoEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTodoRequest) => updateTodo(request),
    onSuccess: () => {
      // 更新後のTodos、更新したtodoを再取得する
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};
