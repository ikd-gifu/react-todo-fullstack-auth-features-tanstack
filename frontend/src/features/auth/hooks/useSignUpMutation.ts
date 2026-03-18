import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../apis/auth";

// useMutation は命令的 作成、更新、削除など
export const useSignUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, email, password, password_confirmation }: {name: string, email: string, password: string, password_confirmation: string}) => signup(name, email, password, password_confirmation),
    onSuccess: (data) => {
      // QueryCache にキー: ['auth']で保存
      // キーに紐づく data: { data: { token, user } }
      queryClient.setQueryData(['auth'], data);
    }
  });
};
