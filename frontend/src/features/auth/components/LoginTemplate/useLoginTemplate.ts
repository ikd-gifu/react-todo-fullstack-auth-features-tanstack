import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useLoginMutation } from "../../hooks/useLoginMutation";

const schema = z.object({
  email: z.string().email("メールアドレスの形式で入力してください"),
  password: z.string().min(8, "8文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof schema>;

export const useLoginTemplate = () => {
  const { signIn } = useAuthContext();
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = handleSubmit(
    useCallback(
      async (values: LoginFormValues) => {
        const res = await loginMutation.mutateAsync(values);

        if (res.code !== 200 || !res.data) {
          setError("email", {
            type: "manual",
            message: res.message ?? "ログインに失敗しました",
          });
          return;
        }

        signIn(res.data.user, res.data.token);
      },
      [loginMutation, setError, signIn]
    )
  );

  return {
    control,
    errors,
    handleLoginSubmit,
  };
};
