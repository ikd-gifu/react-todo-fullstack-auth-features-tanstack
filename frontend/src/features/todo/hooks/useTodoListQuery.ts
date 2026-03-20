import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../apis/todoCrud";

// main.tsxのQueryClientを継承
export const useTodoListQuery = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
};
