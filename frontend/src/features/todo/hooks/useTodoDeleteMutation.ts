import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../apis/todoCrud";
import { DeleteTodoRequest } from "../types/Todo";

// useMutation は命令的 作成、更新、削除など
export const useTodoDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteTodoRequest) => deleteTodo(request),
    onSuccess: (_response, request) => {
      // destroy後は個別キャッシュ自体を削除する
      queryClient.removeQueries({ queryKey: ["todos", request.id], exact: true });
      // 更新後のTodosを再取得する
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
