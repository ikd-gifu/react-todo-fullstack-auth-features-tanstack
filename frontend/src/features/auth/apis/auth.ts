import apiClient, { isAxiosError } from "../../../shared/apis/apiClient";
import { AuthType } from "../types/auth";
import { UserType } from "../../users/types/User";

type ApiResponse<T = undefined> = { code: number; data?: T; message?: string };

const resolveError = (error: unknown) => {
  if (!isAxiosError(error)) return "Unexpected error";
  const body = error.response?.data as { error?: string; errors?: string[] } | undefined;
  return body?.error ?? body?.errors?.[0] ?? error.message;
};

// auth.tsは通信責務だけ担当
export const signup = async (name: string, email: string, password: string, password_confirmation: string) => {
  try {
    const response = await apiClient.post<AuthType>("/auth/signup", {
      user: { name, email, password, password_confirmation },
    });
    // ApiResponse<T>の型アサーションでtry/catch で成功時と失敗時の戻り値を統一
    return { code: response.status, data: response.data } as ApiResponse<AuthType>;
  } catch (error) {
    return { code: isAxiosError(error) ? (error.response?.status ?? 500) : 500, message: resolveError(error) } as ApiResponse;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post<AuthType>("/auth/login", { email, password });
    return { code: response.status, data: response.data } as ApiResponse<AuthType>;
  } catch (error) {
    return { code: isAxiosError(error) ? (error.response?.status ?? 500) : 500, message: resolveError(error) } as ApiResponse;
  }
};

export const checkAuthentication = async () => {
  try {
    const response = await apiClient.get<{ user: UserType }>("/auth/check");
    return { code: response.status, data: response.data } as ApiResponse<{ user: UserType }>;
  } catch (error) {
    return { code: isAxiosError(error) ? (error.response?.status ?? 500) : 500, message: resolveError(error) } as ApiResponse;
  }
};
