// 共通のレスポンス型を定義
export interface TodoResponseType<T = undefined> {
  code: number;
  message?: string;
  data?: T;
}

// APIが返すエラー本文の形だけを表す純粋なDTO（Data Transfer Object）
export type ApiErrorBody = {
  errors: Array<{
    status: string;
    title: string;
    detail: string;
    code?: string;
    source?: { pointer: string };
  }>;
};

// Axiosのエラーオブジェクトの形に合わせたラッパー型
// responseやstatusなどAxios特有の構造を含む
export type AxiosErrorResponseType = {
  message: string;
  response?: {
    status: number;
    data?: ApiErrorBody;
  };
};
