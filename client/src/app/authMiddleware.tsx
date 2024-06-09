import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

let isLoggedIn = false;

export const useAuth = () => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      isLoggedIn = true;
    }
  }, []);

  const logIn = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    isLoggedIn = true;
  };

  const logOut = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    isLoggedIn = false;
    router.push('/signin');
  };

  return { authToken, logIn, logOut };
};

export const checkAuth = () => {
  return isLoggedIn;
};

export const requireAuth = (router) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    router.push('/signin');
  }
};
