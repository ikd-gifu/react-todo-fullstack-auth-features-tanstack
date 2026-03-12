import { useTodoDetailTemplate } from './useTodoDetailTemplate';
import { InputForm, CommonTextArea } from '../../../../shared/components/ui';
import { BasicLayout } from '../../../../shared/components/layouts';
import styles from './style.module.css';

/**
 * Todo詳細表示テンプレート
 * URLパラメータから取得したTodoの詳細情報を表示（読み取り専用）
 */
export const TodoDetailTemplate = () => {
  const { todo } = useTodoDetailTemplate();

  if (!todo) {
    return (
      <BasicLayout title="Todo詳細">
        <div>指定されたTodoは存在しません。</div>
      </BasicLayout>
    )
  }

  // ここ以降は todo が TodoType 型と確定している
  return (
    <BasicLayout title="Todo詳細">
      <div className={styles.detailContainer}>
        <div className={styles.formGroup}>
          <InputForm
            inputValue={todo.title}
            placeholder="タイトル"
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <CommonTextArea
            inputValue={todo.content || ''}
            placeholder="内容"
            rows={5}
            disabled
          />
        </div>
      </div>
    </BasicLayout>
  );
};
