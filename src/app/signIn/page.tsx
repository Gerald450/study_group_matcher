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



export default function SignIn(){

    const [matchedStudents, setMatchedStudents] = useState<Match[]>([]);

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
        } catch (err) {
          console.error("Error signing in: ", err);
        }
      };


    return (
         <div className="text-center">
                <p className="mb-4">Please sign in to see your matches</p>
                <Button onClick={handleGoogleSignIn}>
                  Sign in with Google
                </Button>
        </div>
    )
}