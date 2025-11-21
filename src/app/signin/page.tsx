"use client";
import { auth, provider, db } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function SignIn() {
  //authentication
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;

      setUser(userData);

      const userRef = doc(db, "students", userData.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: userData.displayName || "",
          university: "",
          courses: "",
          availability: "",
          studyStyle: "",
          email: userData.email,
          image: userData.photoURL,
        });
      }
    } catch (err) {
      console.error("Error signing in: ", err);
    }
  };
  return (
    <>
      <Card className="max-w-md w-full mx-auto mt-24 shadow-lg border">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          <h1 className="text-2xl font-bold text-indigo-600">
            Welcome to StudyMatcher
          </h1>dw
          <p className="text-center text-gray-600">
            Please sign in to see your matches and connect with other students.
          </p>
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
