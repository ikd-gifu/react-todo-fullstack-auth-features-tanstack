import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "../apis/todoCrud";
import { UpdateTodoRequest } from "../types/Todo";

// useMutation は命令的 作成、更新、削除など
export const useTodoEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTodoRequest) => updateTodo(request),
    // dataはバックエンドからのレスポンス{id: "", title: "",..}
    // 更新済みの新しいデータを使い、フロントとバックエンドの整合性を担保する
    // variablesはrequestの値 getTodoByIdで指定したidでリクエスト時点で
    // 確定しているのでこれを使う
    onSuccess: (data, variables) => {
      // レスポンスで個別キャッシュ(['todos', id])を即時更新
      // → 詳細・編集ページへ戻った際に再フェッチなしで最新データを表示
      queryClient.setQueryData(['todos', variables.id], data);
      // リストキャッシュ(['todos'])のみを無効化して再フェッチ
      // exact: true で ['todos', id] などの個別キャッシュには影響しない
      queryClient.invalidateQueries({ queryKey: ['todos'], exact: true });
    },
  });
};
