import { Controller } from 'react-hook-form';
import { useTodoEditTemplate } from './useTodoEditTemplate';
import { CommonButton } from '../../../../shared/components/ui';
import { InputFormValidation, TextAreaValidation } from '../../../../shared/components/ui';
import { BasicLayout } from '../../../../shared/components/layouts';
import styles from './style.module.css';

/**
 * Todo編集テンプレート
 * URLパラメータから取得したTodoの編集フォームを提供
 */
export const TodoEditTemplate = () => {
  // カスタムフックでTodoデータ、フォーム状態、更新処理を取得
  const {
    control,
    errors,
    handleEditSubmit,
  } = useTodoEditTemplate();

  const rootErrorMessage = errors.root?.message;

  // Todoが存在しない場合の表示
  if (rootErrorMessage) {
    return (
      <BasicLayout title="Todo編集">
        <div className={styles.notFound}>
          <p>{rootErrorMessage}</p>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout title="Todo編集">
      <form className={styles.formGroup} onSubmit={handleEditSubmit}>
        <div className={styles.formGroup}>
          <Controller
            control={control}
            // RHFが値を紐づけるために、nameはuseTodoEditTemplateのschemaのキーと一致させる必要がある
            name="title"
            render={({ field }) => 
              <InputFormValidation
              // string 前提なので、?? "" を入れて 非制御→制御の警告回避
                inputValue={field.value ?? ""}
                placeholder="タイトルを入力"
                handleChangeValue={field.onChange}
                errorMessage={errors.title?.message}
              />
            }
          />
        </div>

        <div className={styles.formGroup}>
          <Controller
            control={control}
            name="content"
            render={({ field }) =>
              <TextAreaValidation
                inputValue={field.value ?? ""}
                placeholder="詳細な内容を入力（任意）"
                handleChangeValue={field.onChange}
                rows={5}
              />
            }
          />
        </div>

        <div className={styles.buttonGroup}>
          <CommonButton type="submit">
            更新
          </CommonButton>
        </div>
      </form>
    </BasicLayout>
  );
};
