import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../apis/todoCrud";
import { TodoType } from "../types/Todo";

// main.tsxのQueryClientを継承
export const useTodoListQuery = () => {
  // 成功時の data は Todo の配列、失敗時の error は Error 型
  // TanStack Query が正常時・エラー時の状態を保持して返す
  return useQuery<TodoType[], Error>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
};
