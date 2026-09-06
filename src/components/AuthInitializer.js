import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import api from "../utils/api";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/me");

        dispatch(
          loginSuccess({
            user: response.data.user,
          })
        );
      } catch (error) {
        console.log("No active login session.");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#07111f] text-white">
        Checking authentication...
      </div>
    );
  }

  return children;
};

export default AuthInitializer;