import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextApi";

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log('----------here', user)
  return !!user?._id ? children : <Navigate to="/signin" replace />;
}
export default RequireAuth;
