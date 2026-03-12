// 認証ロジックではなく、ユーザードメインの型のためfeatures/users/types/に配置
export type UserType = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
