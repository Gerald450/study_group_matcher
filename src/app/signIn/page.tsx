"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth, provider, db } from "../../lib/firebase";
import { signInWithPopup, User } from "firebase/auth";
import DashboardStats from "@/components/dashboard/dashboardStats";
import ProfileSummary from "@/components/dashboard/profileSummary";
import RecentActivity from "@/components/dashboard/recentActivity";
import QuickActions from "@/components/dashboard/quickActions";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import Navbar from "@/components/ui/navbar";
import { onAuthStateChanged } from "firebase/auth";
import ChatRoom from "@/components/ui/ChatRoom";
import matchStudents from "@/components/matchStudents";
import { Student, Match } from "@/components/matchStudents";
import docDataToStudent from "@/components/docToStudent";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [matchedStudents, setMatchedStudents] = useState<Match[]>([]);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const userData = result.user;

      const userRef = doc(db, "students", userData.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create user doc if it doesn't exist
        await setDoc(userRef, {
          id: userData.uid,
          name: userData.displayName,
          university: "",
          courses: "",
          availability: "",
          studyStyle: "",
          email: userData.email,
          image: userData.photoURL,
        });
      }

      const freshSnap = await getDoc(userRef);
      const student = docDataToStudent(freshSnap);
      const matched = await matchStudents(student);
      setMatchedStudents(matched);
      router.push("/");
    } catch (err) {
      console.error("Error signing in: ", err);
    }
  };

  return (
    <>
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-xl shadow-lg ring-1 ring-gray-200">
        <p className="text-center text-gray-800 text-xl font-semibold mb-8">
          Please sign
        </p>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.55 1.22 8.91 3.21l6.63-6.63C34.3 2.67 29.46 0 24 0 14.9 0 7.08 5.5 3.27 13.37l7.7 6c1.8-5.42 6.85-10.87 12.03-10.87z"
            />
            <path
              fill="#4285F4"
              d="M46.53 24.64c0-1.49-.13-2.94-.37-4.35H24v8.24h12.74c-.55 2.95-2.3 5.43-4.9 7.1l7.52 5.82c4.37-4.03 6.97-9.96 6.97-16.81z"
            />
            <path
              fill="#FBBC05"
              d="M10.97 28.99a14.43 14.43 0 0 1 0-9.98v-6.02H3.27a24.02 24.02 0 0 0 0 21.99l7.7-6z"
            />
            <path
              fill="#34A853"
              d="M24 46.5c6.14 0 11.3-2 15.07-5.43l-7.52-5.82c-2.08 1.4-4.77 2.23-7.55 2.23-5.16 0-9.54-3.5-11.12-8.27l-7.7 6c3.7 7.41 11.18 12.3 18.82 12.3z"
            />
          </svg>
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
    </>
  );
}
