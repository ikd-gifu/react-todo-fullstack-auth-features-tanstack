import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../apis/auth";

// useMutation は命令的 作成、更新、削除など
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: {email: string, password: string}) => login(email, password),
    onSuccess: (data) => {
      // QueryCache にキー: ['auth']で保存
      queryClient.setQueryData(['auth'], data);
    }
  });
};
