import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS } from "../../../shared/constants/navigation";
import { removeAxiosAuthentication, setAxiosAuthentication } from "../../../shared/apis/apiClient";
import { UserType } from "../../users/types/User";
import { useCheckAuthenticationQuery } from "./useCheckAuthenticationQuery";

// 認証ロジック（API確認、signIn/signOut、遷移）の責務
export const useAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  // checkAuthentication の呼び出しを query に移譲
  // data はチェック結果
  const { data: authData, isLoading } = useCheckAuthenticationQuery();

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
    if (isLoading) return;

    const isPublic = pathname === NAV_ITEMS.LOGIN || pathname === NAV_ITEMS.SIGNUP;
    const hasToken = !!localStorage.getItem("authentication");

    // 公開ページでtokenがない場合、checkAuthenticationを実行しない
    if (isPublic && !hasToken) {
      setUser(null);
      setIsAuth(false);
      return;
    }

    // await checkAuthentication() の代わりに query の data を参照
    const authed = authData?.code === 200 && !!authData?.data?.user;
    if (authed && authData?.data) { setUser(authData.data.user); setIsAuth(true); }
    // 未認証で保護ページならログインへ遷移
    if (!authed && !isPublic) navigate(NAV_ITEMS.LOGIN);
    // 認証済みで公開ページならTOPへ遷移
    if (authed && isPublic) navigate(NAV_ITEMS.TOP);

  }, [authData, isLoading, pathname, navigate]);

  return { user, isAuth, signIn, signOut, isLoading };
};
