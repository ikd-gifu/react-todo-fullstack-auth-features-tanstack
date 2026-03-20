import { useParams } from "react-router";
import { useTodoQuery } from "../../hooks"

// Todo: コンポーネント化（TodoDetailTemplate.tsx）し
// TodoDetailTemplate はデータ取得と状態制御のみ担当する
// TodoDetailView を新設し、表示専用に分離する
export const useTodoDetailTemplate = () => {
  const { id } = useParams();
  const todoId = Number(id);
  const { data: todo, isLoading, isError, error} = useTodoQuery(todoId);

  return {
    todo,
    isLoading,
    isError,
    error,
  };
};
