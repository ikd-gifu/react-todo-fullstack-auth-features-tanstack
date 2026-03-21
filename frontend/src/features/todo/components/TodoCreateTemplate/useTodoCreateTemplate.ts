import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { NAV_ITEMS } from '../../../../shared/constants/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTodoCreateMutation } from '../../hooks';

// オブジェクトスキーマを定義
const TodoCreateFormSchema = z.object({
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

// useFormはフォーム全体の型を明示しないと、
// handleSubmitやerrorsの型が曖昧になりやすいので、フォーム全体の型定義を作成
// 型をスキーマから拡張するためにz.inferを使用して型エイリアスを定義
type TodoCreateFormValues = z.infer<typeof TodoCreateFormSchema>;

/**
 * TodoCreateTemplateのページ固有UI状態管理
 * フォーム入力の状態とバリデーション、送信処理を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoCreateTemplate = () => {
  const navigate = useNavigate();
  // hooksはトップレベルで呼び出す
  const todoCreateMutation = useTodoCreateMutation();

  const {
    control, // コンポーネントを登録するためのメソッドを含む
    handleSubmit, // フォームの検証が成功した場合にフォーム データを送信するための関数
    formState: { errors }, // フォーム全体の状態に関する情報を含む フィールドエラーを持つオブジェクト
    // 分割代入で中の errors プロパティを取り出して、ローカル変数 errors として受け取る
    setError,
  } = useForm<TodoCreateFormValues>({ // useFormがフォーム状態を管理する型を指定
    resolver: zodResolver(TodoCreateFormSchema), // Zodの検証をRHFに統合
    defaultValues: {
      title: '',
      content: undefined,
    }
  });

  // タイトル入力フィールドの状態管理、内容入力フィールドの状態管理
  // フォーム送信とTodoの実際の作成処理を分離
  const handleCreateSubmit = handleSubmit(
    useCallback(
      async (values: TodoCreateFormValues) => {
        try {
          await todoCreateMutation.mutateAsync({
            title: values.title,
            content: values.content,
          });

          navigate(NAV_ITEMS.TOP); // 登録後にトップページへ遷移
        } catch (error) {
          const message = error instanceof Error ? error.message : '作成に失敗しました';
          setError('root', { type: 'manual', message });
        }
      },
      [navigate, setError, todoCreateMutation]
    )
  );

  return {
    control,
    errors,
    handleCreateSubmit,
  };
};
