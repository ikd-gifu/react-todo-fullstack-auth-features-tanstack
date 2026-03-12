import { createContext, type FC, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { type UserType } from "../../users/types/User";

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextType = {
  user: UserType | null;
  isAuth: boolean;
  signIn: (user: UserType, token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  signIn: () => {},
  signOut: () => {},
});

export { AuthContext };

// Contextへ注入（グローバル共有化）
export const AuthProvider: FC<AuthContextProps> = ({ children }) => {
  const { user, isAuth, signIn, signOut } = useAuth();

  return (
    <AuthContext.Provider value={{ user, isAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
