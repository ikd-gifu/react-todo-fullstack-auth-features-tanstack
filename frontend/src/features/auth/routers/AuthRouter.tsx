// AuthRouter.tsx
import { Routes, Route } from "react-router";
import { PATHS } from "../../../shared/constants/navigation";
import { LoginPage, SignUpPage } from "../../../pages";

export const AuthRouter = () => (
  <Routes>
    <Route path={PATHS.LOGIN} element={<LoginPage />} />
    <Route path={PATHS.SIGNUP} element={<SignUpPage />} />
    {/* Routes 構成で未一致時に出る警告を回避 */}
    <Route path="*" element={null} />
  </Routes>
);
