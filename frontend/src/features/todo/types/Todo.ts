// データ構造（DTO/Model）なのでtypeで定義 データの実体の型
// グローバルに影響を与えないようにexport付きで定義
export type TodoType = {
  id: number;
  title: string;
  // content?: stringにすると、今度は読み取り側（詳細/編集/表示など）で
  // contentがundefinedになる可能性が増えてしまうため、ここでは必須にする
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTodoRequest = {
  title: string;
  content?: string;
};

export type GetTodoRequest = {
  id: number;
};

export type UpdateTodoRequest = {
  id: number;
  title: string;
  content?: string;
};

export type DeleteTodoRequest = {
  id: number;
};
