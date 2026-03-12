import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// useAuthContext()でsignIn / signOut取得
export const useAuthContext = () => useContext(AuthContext);
