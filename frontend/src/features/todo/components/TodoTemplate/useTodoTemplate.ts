import { useMemo, useState, useEffect, useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { getTodos, deleteTodo } from "../../apis/todoCrud";
import { TodoType } from "../../types/Todo";

// defaultValuesで""を使うため、string型で定義 optionalは不要
// react-hook-formはフィールド名で値を紐づけるため、
// schemaのキーはdefaultValues・Controllerのnameは
// 同じキー（search）で揃える必要がある
const SearchFormSchema = z.object({
  search: z.string(),
});

type SearchFormFormValue = z.infer<typeof SearchFormSchema>;

/**
 * TodoTemplateのページ固有UI状態管理
 * 検索機能など、表示・操作に関わる一時的な状態を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoTemplate = () => {
  // 型推論が機能: originalTodoListがArray<TodoType>と正しく推論される
  const [originalTodoList, setOriginalTodoList] = useState<Array<TodoType>>([]);

  // useEffectを副作用（API呼び出し）の再実行を防ぐためにuseCallbackでラップ
  const fetchTodos = useCallback(async () => {
    try {
      const res = await getTodos();
      if (!res.data) {
        console.error(res.message || "No data received");
        return;
      }

      setOriginalTodoList(res.data);

    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, []);

  const {
    control,
  } = useForm<SearchFormFormValue>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  const searchInputValue = useWatch({ control, name: "search" }) ?? "";

  const handleDeleteTodo = useCallback(
    async (targetId: number, targetTitle: string) => {
    // 確認ダイアログを表示
    if (!window.confirm(`「${targetTitle}」を削除しますか？`)) {
      return;
    }

    const res = await deleteTodo({ id: targetId });
    // 204 No Contentも成功とみなす res.dataはundefined
    const isSuccess = res.code === 204 || Boolean(res.data);
    if (!isSuccess) {
      console.error(res.message || "Failed to delete todo");
      return;
    }

    // バックエンドで削除が成功した場合にフロントエンドの状態からも削除
    setOriginalTodoList((prev) => prev.filter((todo) => todo.id !== targetId));
  },
  [setOriginalTodoList] // ESLintの警告回避のために依存配列にset関数を追加
);

  // 検索キーワードに基づいて表示するTodoリストを絞り込む
  // useMemoで派生状態を最適化
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
    // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  useEffect(() => {
    fetchTodos(); // fetchTodos() が await getTodos() を挟むので非同期処理
  }, [fetchTodos]);

  return {
    control,
    showTodoList,
    handleDeleteTodo,
  };
};
