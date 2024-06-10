import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

let isLoggedIn = false;

export const useAuth = () => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      isLoggedIn = true;
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const profileResponse = await axios.get(
        "http://localhost:3000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUserId(profileResponse.data.id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logOut();  // Log out if there is an error fetching the profile
    }
  };

  const logIn = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    isLoggedIn = true;
    fetchUserProfile(token);
  };

  const logOut = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUserId(null);
    isLoggedIn = false;
    router.push('/signin');
  };

  return { authToken, userId, logIn, logOut };
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
