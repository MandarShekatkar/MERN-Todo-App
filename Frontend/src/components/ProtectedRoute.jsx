import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
 
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/todos", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
