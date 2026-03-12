// Router.tsx
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../features/auth/contexts/AuthContext";
import { AuthRouter } from "../features/auth/routers/AuthRouter";
import { TodoRouter } from "../features/todo/routers/TodoRouter";

// useAuth のガードでsignIn/signOut判定、遷移させる
export const Router = () => (
  <BrowserRouter>
    <AuthProvider>
      <AuthRouter />
      <TodoRouter />
    </AuthProvider>
  </BrowserRouter>
);
