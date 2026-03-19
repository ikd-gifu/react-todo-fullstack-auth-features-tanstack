import { useMemo, useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { deleteTodo } from "../../apis/todoCrud";
import { useTodoListQuery} from "../../hooks"

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
  // queryのdataがundefinedの可能性があるため[]を初期値としておく
  const { data: originalTodoList = [], isLoading, isError, error } = useTodoListQuery();

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
    // deleteのQuery連携は後段で実施（invalidateQueries or setQueryData）
  },
  []
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

  return {
    control,
    showTodoList,
    handleDeleteTodo,
    isLoading,
    fetchErrorMessage: isError ? (error?.message ?? "Todoの取得に失敗しました") : null,
  };
};
