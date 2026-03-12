import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { NAV_ITEMS } from '../../../../shared/constants/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getTodoById, updateTodo } from '../../apis/todoCrud';

// オブジェクトスキーマを定義
const TodoEditFormSchema = z.object({
  title: 
    z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(20, { message: 'タイトルは20文字以内で入力してください' }),
  content:
    z
    .string()
    .optional(),
});

// 型をスキーマから拡張するためにz.inferを使用して型エイリアスを定義
// z.infer<typeof schema> にすると、schema から型を
// 自動生成できるため「型定義」と「バリデーション」
// を同じ schema に集約できます。
// 結果として型の二重管理やズレを防げます。
type TodoEditFormSchema = z.infer<typeof TodoEditFormSchema>;

/**
 * Todo編集テンプレート用のカスタムフック
 * URLパラメータからTodoを取得し、フォーム状態と更新処理を提供
 */
export const useTodoEditTemplate = () => {
  const { id } = useParams(); // URLからidパラメータを取得
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<TodoEditFormSchema>({ // フォーム全体の状態管理と操作APIを提供するフック
    resolver: zodResolver(TodoEditFormSchema),
    defaultValues: {
      title: "",
      content: "",
    }
  });

  const fetchTodo = useCallback(async () => {
    const todoId = Number(id);
    if (!id || Number.isNaN(todoId)) {
      setError("root", { message: "指定されたTodoが見つかりませんでした" });
      return;
    }

    const res = await getTodoById({ id: todoId });
    if (!res.data) {
      setError("root", { message: "指定されたTodoが見つかりませんでした" });
      return;
    }

    setValue("title", res.data.title ?? "");
    setValue("content", res.data.content ?? "");
  }, [id, setValue, setError]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  /**
   * Todo更新処理
   */
  // <form>を使わないのでe: FormEventなど不要
  const handleEditSubmit = handleSubmit(
    useCallback(
      async (values: TodoEditFormSchema) => {
        const todoId = Number(id);
        if (!id || Number.isNaN(todoId)) {
          setError("root", { message: "指定されたTodoが見つかりませんでした" });
          return;
        }

        const res = await updateTodo({
          id: todoId,
          title: values.title,
          content: values.content ?? "",
        });

        if (!res.data) {
          setError("root", { message: res.message || "更新に失敗しました" });
          return;
        }
          navigate(NAV_ITEMS.TOP);
        },
        [id, navigate, setError]
      )
  );

  return {
    control,
    errors,
    handleEditSubmit,
  };
};
