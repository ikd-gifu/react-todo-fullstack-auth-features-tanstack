import { useQuery } from "@tanstack/react-query";
import { getTodoById } from "../apis/todoCrud";

// main.tsxのQueryClientを継承
export const useTodoQuery = (id: number) => {
  return useQuery({
    queryKey: ["todos", id], // idごとに別キャッシュ"todos"とも別
    queryFn: () => getTodoById({ id }),
    enabled: !!id, // idが確定したらデータ取得
  });
};
