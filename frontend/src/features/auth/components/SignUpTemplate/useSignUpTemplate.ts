import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useSignUpMutation } from "../../hooks/useSignUpMutation";

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
  const signUpMutation = useSignUpMutation();

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
        const res = await signUpMutation.mutateAsync(values);

        if (!res.data) {
          setError("email", {
            type: "manual",
            message: res.message ?? "新規登録に失敗しました",
          });
          return;
        }

        signIn(res.data.user, res.data.token);
      },
      [setError, signIn, signUpMutation]
    )
  );

  return {
    control,
    errors,
    handleSignUpSubmit,
  };
};
