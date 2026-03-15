import { useQuery } from "@tanstack/react-query";
import { checkAuthentication } from "../apis/auth";

// auth.tsの認証確認責務のみを分離
export const useCheckAuthenticationQuery = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthentication,
    retry: false,
    staleTime: 1000 * 60 * 30,
  });
};
