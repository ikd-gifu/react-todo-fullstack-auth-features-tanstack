import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signup } from "../../apis/auth";
import { useAuthContext } from "../../hooks/useAuthContext";

const schema = z
  .object({
    name: z.string().min(1, "1文字以上で入力してください"),
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(8, "8文字以上で入力してください"),
    password_confirmation: z.string().min(8, "8文字以上で入力してください"),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "確認用パスワードと一致しません",
    path: ["password_confirmation"],
  });

type SignUpFormValues = z.infer<typeof schema>;

export const useSignUpTemplate = () => {
  const { signIn } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSignUpSubmit = handleSubmit(
    useCallback(
      async (values: SignUpFormValues) => {
        const res = await signup(
          values.name,
          values.email,
          values.password,
          values.password_confirmation
        );

        if (res.code !== 201 || !res.data) {
          setError("email", {
            type: "manual",
            message: res.message ?? "新規登録に失敗しました",
          });
          return;
        }

        signIn(res.data.user, res.data.token, res.code);
      },
      [setError, signIn]
    )
  );

  return {
    control,
    errors,
    handleSignUpSubmit,
  };
};
