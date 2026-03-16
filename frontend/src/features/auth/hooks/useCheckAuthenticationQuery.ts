import { useQuery } from "@tanstack/react-query";
import { checkAuthentication } from "../apis/auth";

// auth.tsの認証確認責務のみを分離
// 型定義はauth.tsがあるので省略
export const useCheckAuthenticationQuery = () => {
  // マウント時に実行
  return useQuery({
    queryKey: ["auth"], // クエリキャッシュのキー
    queryFn: checkAuthentication, // クエリがデータを要求するために使用する関数
    retry: false, // enableはtrueなので 常にチェックし、エラーになれば停止
    staleTime: 1000 * 60 * 30,
  });
};
