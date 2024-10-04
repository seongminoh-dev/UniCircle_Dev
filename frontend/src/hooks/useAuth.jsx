import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth should be used within AuthProvider");
  }
  return authContext;
};
