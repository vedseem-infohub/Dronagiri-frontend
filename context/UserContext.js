"use client";

import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();

const USER_TOKEN_KEY = "dronagiri_user_token";

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(USER_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setStoredToken = (token) => {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(USER_TOKEN_KEY, token);
      const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax${secureFlag}`;
    } else {
      localStorage.removeItem(USER_TOKEN_KEY);
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    }
  } catch (e) {
    console.error("Token storage error:", e);
  }
};

// Global Axios Request and Response Interceptor for token attachment (Safari ITP / Cross-Domain fallback)
if (typeof window !== "undefined") {
  if (!window.__axiosAuthInterceptorAttached) {
    window.__axiosAuthInterceptorAttached = true;

    axios.interceptors.request.use(
      (config) => {
        const token = getStoredToken();
        if (token) {
          config.headers = config.headers || {};
          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const url = error.config?.url || "";
        if (
          error.response?.status === 401 &&
          !url.includes("/api/auth/signin") &&
          !url.includes("/api/auth/signup")
        ) {
          setStoredToken(null);
        }
        return Promise.reject(error);
      }
    );
  }
}

const UserContext = ({ children, initialUser }) => {
  const serverUrl =
    process.env.NEXT_PUBLIC_API_BACKEND_URL ||
    process.env.NEXT_API_BACKEND_URL ||
    "https://dronagiri-backend-e4ja.onrender.com";

  const [userData, setuserData] = useState(initialUser || null);
  const [loding, setloding] = useState(initialUser === undefined);

  const handleCurrentUser = async () => {
    setloding(true);
    try {
      const token = getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
        headers,
      });
      setuserData(result.data);
      return result.data;
    } catch (error) {
      setuserData(null);
      if (error?.response?.status === 401) {
        setStoredToken(null);
      }
      return null;
    } finally {
      setloding(false);
    }
  };

  const login = async (email, password) => {
    const result = await axios.post(
      `${serverUrl}/api/auth/signin`,
      { email, password },
      { withCredentials: true }
    );
    if (result.data?.token) {
      setStoredToken(result.data.token);
    }
    setuserData(result.data);
    return result.data;
  };

  const signup = async (name, email, password) => {
    const result = await axios.post(
      `${serverUrl}/api/auth/signup`,
      { name, email, password },
      { withCredentials: true }
    );
    if (result.data?.token) {
      setStoredToken(result.data.token);
    }
    setuserData(result.data);
    return result.data;
  };

  const logout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.warn("Logout request error:", error);
    }
    setStoredToken(null);
    setuserData(null);
  };

  useEffect(() => {
    if (initialUser !== undefined) {
      return;
    }
    let isMounted = true;
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(`${serverUrl}/api/user/current`, { withCredentials: true, headers })
      .then((result) => {
        if (isMounted) setuserData(result.data);
      })
      .catch((error) => {
        if (isMounted) {
          setuserData(null);
          if (error?.response?.status === 401) {
            setStoredToken(null);
          }
        }
      })
      .finally(() => {
        if (isMounted) setloding(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialUser, serverUrl]);

  const value = {
    serverUrl,
    userData,
    setuserData,
    isLoggedIn: Boolean(userData),
    login,
    signup,
    logout,
    refreshCurrentUser: handleCurrentUser,
    loding,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
