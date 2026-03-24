import apiClient from "../../../shared/apis/apiClient";
import { TodoType, CreateTodoRequest, GetTodoRequest, UpdateTodoRequest, DeleteTodoRequest } from "../types/Todo";
import { ApiErrorBody } from "../../../shared/types/TodoResponse";
import { isAxiosError, AxiosError } from "axios";

/**
 * Todo CRUD API
 * API 呼び出しだけを行う関数群
 * いつ・どのように呼び出すかは呼び出し側(template)に任せる
 */
export const getTodos = async () => {
  try {
    // localhost:3001/api/v1/todos
    const response = await apiClient.get<Array<TodoType>>('/todos');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      const message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error");
  }
};

export const createTodo = async (payload: CreateTodoRequest) => {
  // 引数にオブジェクト(payload)を渡すので、payloadの型をオブジェクト型のCreateTodoRequestに指定
  try {
    const response = await apiClient.post<TodoType>('/todos', payload); // payloadオブジェクトをわたす
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      const message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error");
  }
};

// { id: number } というオブジェクトを引数に渡す
export const getTodoById = async (payload: GetTodoRequest) => {
  try {
    // レスポンスはArray<TodoType>ではなくTodoType単体
    const response = await apiClient.get<TodoType>(`/todos/${payload.id}`);
    return response.data; // todoのみ返す
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      const message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
      throw new Error(message);
    }
    throw new Error("Unexpected error");
  }
};

export const updateTodo = async (payload: UpdateTodoRequest) => {
  try {
    const { id, ...body } = payload; // idをURLに使い、残り(title, content)をbodyに展開
    const response = await apiClient.put<TodoType>(`/todos/${id}`, body);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      const message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
      throw new Error(message);
    }
    throw new Error("Unexpected error");
  }
};

export const deleteTodo = async (payload: DeleteTodoRequest) => {
  try {
    // レスポンスのdataは""
    await apiClient.delete<void>(`/todos/${payload.id}`);
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      const message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error");
  }
};
