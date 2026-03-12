// useAuthContext 依存あり（例外的に shared に配置）
// ヘッダーが肥大化したらUI/Container分離する
import { useAuthContext } from "../../../../features/auth/hooks/useAuthContext";
import styles from "./style.module.css";

export const AppHeader = () => {
  const { signOut } = useAuthContext();
  return (
    <header className={styles.header}>
      <p className={styles.title}>Todo アプリ</p>
      <button className={styles.logoutButton} onClick={signOut}>ログアウト</button>
    </header>
  );
};
