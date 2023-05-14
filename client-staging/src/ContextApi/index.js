import { createContext, useMemo } from "react";
import { useLocalStorage } from "./../Services/CustomHooks/useLocalStorage";

const defaultContext = { user: null, setContextUser: () => { } };
export const AuthContext = createContext(defaultContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const value = useMemo(() => ({
    user,
    setContextUser: setUser
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
