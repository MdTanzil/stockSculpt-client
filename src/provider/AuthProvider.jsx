/* eslint-disable react/prop-types */
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

import useAxiosPublic from "@/hooks/useAxiosPublic";
import app from "./../firebase/firebase.config";
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const createUser = (email, password) => {
    setLoading(false);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(false);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(false);
    setUser(null);
    setRole(null);

    return signOut(auth);
  };

  const updateUserProfile = (displayName, url) => {
    return updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: url,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = { email: user.email, provider: "google" };

        try {
          //TODO: send  a request to backend and get token
          const res = await axiosPublic.post("/auth/login", userEmail);
          if (res.data.accessToken) {
            localStorage.setItem(
              "access-token",
              `Bearer ${res.data.accessToken}`
            );
            // The login response carries the user's role ("user" / "admin");
            // AdminRouter reads it from context to guard /admin routes.
            setRole(res.data.role || null);
          } else {
            localStorage.removeItem("access-token");
            setRole(null);
          }
        } catch (error) {
          console.error("JWT request failed:", error);
          localStorage.removeItem("access-token");
          setRole(null);
        } finally {
          setLoading(false);
        }

        setUser(user);
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  if (loading) {
    return <PacmanLoader color="#36d7b7" />;
  }
  const authData = {
    user,
    role,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    setUser,
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
