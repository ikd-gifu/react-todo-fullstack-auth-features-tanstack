// 共通のレスポンス型を定義
export interface TodoResponseType<T = undefined> {
  code: number;
  message?: string;
  data?: T;
}

// APIが返すエラー本文の形だけを表す純粋なDTO（Data Transfer Object）
// Rails APIの設定に対応
export type ApiErrorBody = {
  errors: Array<{
    status: string;
    title: string;
    detail: string;
    code?: string;
    source?: { pointer: string };
  }>;
};
