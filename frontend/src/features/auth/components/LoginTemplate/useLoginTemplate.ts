import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { login } from "../../apis/auth";
import { useAuthContext } from "../../hooks/useAuthContext";

const schema = z.object({
  email: z.string().email("メールアドレスの形式で入力してください"),
  password: z.string().min(8, "8文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof schema>;

export const useLoginTemplate = () => {
  const { signIn } = useAuthContext();

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
        const res = await login(values.email, values.password);

        if (res.code !== 200 || !res.data) {
          setError("email", {
            type: "manual",
            message: res.message ?? "ログインに失敗しました",
          });
          return;
        }

        signIn(res.data.user, res.data.token);
      },
      [setError, signIn]
    )
  );

  return {
    control,
    errors,
    handleLoginSubmit,
  };
};
