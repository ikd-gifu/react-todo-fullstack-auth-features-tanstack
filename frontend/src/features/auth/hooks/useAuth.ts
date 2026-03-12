import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS } from "../../../shared/constants/navigation";
import { checkAuthentication } from "../apis/auth";
import { removeAxiosAuthentication, setAxiosAuthentication } from "../../../shared/apis/apiClient";
import { UserType } from "../../users/types/User";

// 認証ロジック（API確認、signIn/signOut、遷移）の責務
export const useAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  // 認証状態管理責務を担当
  // レスポンスのuserに入れ替える（nextUser）
  const signIn = useCallback((nextUser: UserType, token: string) => {
    setUser(nextUser);
    setIsAuth(true);
    setAxiosAuthentication(token);
    navigate(NAV_ITEMS.TOP);
  }, [navigate]);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuth(false);
    removeAxiosAuthentication();
    navigate(NAV_ITEMS.LOGIN);
  }, [navigate]);

  // AuthProviderで全ページに配布
  // pathname が変わると認証状態を再判定して、必要ならリダイレクト
  useEffect(() => {
    const run = async () => {
      const isPublic = pathname === NAV_ITEMS.LOGIN || pathname === NAV_ITEMS.SIGNUP;
      const hasToken = !!localStorage.getItem("authentication");

      // 公開ページでtokenがない場合、checkAuthenticationを実行しない
      if (isPublic && !hasToken) {
        setUser(null);
        setIsAuth(false);
        return;
      }

      const res = await checkAuthentication();
      const authed = res.code === 200 && !!res.data?.user;
      if (authed && res.data) { setUser(res.data.user); setIsAuth(true); }
      // 未認証で保護ページならログインへ遷移
      if (!authed && !isPublic) navigate(NAV_ITEMS.LOGIN);
      // 認証済みで公開ページならTOPへ遷移
      if (authed && isPublic) navigate(NAV_ITEMS.TOP);
    };
    run();
  }, [navigate, pathname]);

  return { user, isAuth, signIn, signOut };
};
