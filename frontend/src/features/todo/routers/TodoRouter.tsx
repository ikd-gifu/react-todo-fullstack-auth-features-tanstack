// React Router v7を利用しているが、<BrowserRouter> + <Routes> パターン（宣言的ルーティング）で実装
// バックエンド連携のタイミングで createBrowserRouter に移行？
// 大規模に移行する場合は分割するのが望ましい
// index.ts - エクスポート用
// Router.tsx - <BrowserRouter>のラッパー
// TodoRouter.tsx - <Routes>と<Route>の定義
import { Routes, Route } from 'react-router';
import { PATHS } from '../../../shared/constants/navigation.js';
import { TodoPage, TodoDetailPage, TodoCreatePage, TodoEditPage } from '../../../pages/index.js';
import { AuthenticatedLayout } from '../../auth/routers/AuthenticatedLayout.js';

export const TodoRouter = () => {
  return (
    <Routes>
      <Route element={<AuthenticatedLayout />}>
        {/* index属性でトップページを指定 */}
        <Route path={PATHS.TOP} element={<TodoPage />} />
        <Route path={PATHS.DETAIL} element={<TodoDetailPage />} />
        <Route path={PATHS.CREATE} element={<TodoCreatePage />} />
        <Route path={PATHS.EDIT} element={<TodoEditPage />} />
      </Route>
      {/* Routes 構成で未一致時に出る警告を回避 */}
      <Route path="*" element={null} />
    </Routes>
  );
};
