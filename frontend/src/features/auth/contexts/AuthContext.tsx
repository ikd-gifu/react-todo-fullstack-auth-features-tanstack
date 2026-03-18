import { createContext, type FC, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { type UserType } from "../../users/types/User";

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextType = {
  signIn: (user: UserType, token: string, code: number) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => {},
  signOut: () => {},
});

export { AuthContext };

// Contextへ注入（グローバル共有化）
export const AuthProvider: FC<AuthContextProps> = ({ children }) => {
  const { signIn, signOut } = useAuth();

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
