"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios"; 

import { AuthContext } from "./AuthContext";
import { auth } from "@/firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  // 1. Remove manual setLoading(true) from auth actions. 
  // Let onAuthStateChanged manage the loading workflow cleanly.
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const goWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
      setRoleLoading(false);
    }
  };

  const updateUser = (profile) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user.");
    }
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.uid) {
        setRoleLoading(true);
        try {
          const res = await axios.get(`/api/users/role?uid=${currentUser.uid}`);
          if (res.data?.success) {
            setRole(res.data.role);
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRole(null);
        setRoleLoading(false);
      }

      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    loading: loading || roleLoading,
    roleLoading,
    registerUser,
    signInUser,
    goWithGoogle,
    logOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;