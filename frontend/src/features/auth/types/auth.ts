import { UserType } from "../../users/types/User";

export type AuthType = {
  token: string;
  user: UserType;
};