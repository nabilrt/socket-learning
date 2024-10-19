import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, userDetails } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoader, setLoginLoader] = useState(false);
  const [authenticated, setIsAuthenticated] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    async function checkLogin() {
      try {
        // Check if there's a user in local storage
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          const response = await userDetails();
          if (response?.data && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            // Store user in local storage
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, [navigate]);

  const userLogin = async (data) => {
    setLoginLoader(true);
    try {
      const response = await loginUser(data);
      console.log(response);
      if (response.data.token !== "") {
        localStorage.setItem("token", response.data.token);
        const userData = await userDetails();
        setUser(userData.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData.data.user));
        navigate("/messenger");
        return null; // No error
      } else {
        return "Invalid username or password."; // Return error message
      }
    } catch (error) {
      return "An error occurred during login. Please try again."; // Return error message for exceptions
    } finally {
      setLoginLoader(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        userLogin,
        loginLoader,
        logout,
        authenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
