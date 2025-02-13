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

    return signOut(auth);
  };

  const updateUserProfile = (displayName, url) => {
    return updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: url,
    });
  };
  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = { email: user.email, provider: "google" };
        console.log(userEmail);

        try {
          //TODO: send  a request to backend and get token
          const res = await axiosPublic.post("/auth/login", userEmail);
          if (res.data.accessToken) {
            localStorage.setItem(
              "access-token",
              `Bearer ${res.data.accessToken}`
            );
            console.log("token set");
          } else {
            localStorage.removeItem("access-token");
          }
        } catch (error) {
          console.error("JWT request failed:", error);
          localStorage.removeItem("access-token");
        } finally {
          setLoading(false);
        }

        setUser(user);
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <PacmanLoader color="#36d7b7" />;
  }
  const authData = {
    user,
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
