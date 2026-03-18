import { useQuery } from "@tanstack/react-query";
import { checkAuthentication } from "../apis/auth";

// auth.tsの認証確認責務のみを分離
// 認証トークンがあるときだけ実行
export const useCheckAuthenticationQuery = (enabled: boolean) => {

  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthentication,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 30,
  });
};
