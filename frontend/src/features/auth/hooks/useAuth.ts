import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS } from "../../../shared/constants/navigation";
import { removeAxiosAuthentication, setAxiosAuthentication } from "../../../shared/apis/apiClient";
import { UserType } from "../../users/types/User";
import { useCheckAuthenticationQuery } from "./useCheckAuthenticationQuery";
import { useQueryClient } from '@tanstack/react-query';

// 認証ロジック（API確認、signIn/signOut、遷移）の責務
export const useAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem("authentication");

  // checkAuthentication の呼び出しを query に移譲
  // data はチェック結果 { data: { user } }
  // まずはキャッシュを取得
  const { data: authData, isLoading, isSuccess } = useCheckAuthenticationQuery(hasToken);

  // 認証状態管理責務を担当
  // レスポンスのuserに入れ替える（nextUser）
  const signIn = useCallback((nextUser: UserType, token: string) => {
    setAxiosAuthentication(token);
    // useState()を使わずに'auth'をキーとしてqueryキャッシュを更新
    queryClient.setQueryData(['auth'], { data: { token, user: nextUser } });
    // ブラウザのURLを書き換え
    navigate(NAV_ITEMS.TOP);
  }, [navigate, queryClient]);

  const signOut = useCallback(() => {
    removeAxiosAuthentication();
    // 'auth'キャッシュを完全削除（undefined）
    queryClient.removeQueries({ queryKey: ['auth'] });
    navigate(NAV_ITEMS.LOGIN);
  }, [navigate, queryClient]);

  // AuthProviderで全ページに配布
  // pathname が変わると認証状態を再判定して、必要ならリダイレクト
  useEffect(() => {
    if (isLoading) return;

    const isPublic = pathname === NAV_ITEMS.LOGIN || pathname === NAV_ITEMS.SIGNUP;
    // 公開ページでtokenがない場合は判定不要
    if (isPublic && !hasToken) {
      return;
    }

    // query 成功時のみ認証済み判定する
    const authed = isSuccess && !!authData?.data?.user;
    // 未認証で保護ページならログインへ遷移
    if (!authed && !isPublic) navigate(NAV_ITEMS.LOGIN);
    // 認証済みで公開ページならTOPへ遷移
    if (authed && isPublic) navigate(NAV_ITEMS.TOP);

  }, [authData, isLoading, isSuccess, pathname, navigate, hasToken]);

  return { signIn, signOut, isLoading };
};
