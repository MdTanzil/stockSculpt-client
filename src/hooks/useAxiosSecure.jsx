import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  // baseURL: "http://localhost:3000/api/",
  baseURL: "https://stock-sculpt-server.vercel.app/api/",
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.authorization = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        // 401 means the session is gone — sign out. 403 means the
        // signed-in user is simply not allowed (a free plan hitting a
        // paid feature, or the product limit) — that must NOT sign
        // them out, or every limit message would log them out.
        if (status === 401) {
          await logOut();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut]);

  return axiosSecure;
};

export default useAxiosSecure;
