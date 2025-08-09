"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import DashboardStats from "@/components/dashboard/dashboardStats";
import ProfileSummary from "@/components/dashboard/profileSummary";
import RecentActivity from "@/components/dashboard/recentActivity";
import QuickActions from "@/components/dashboard/quickActions";
import Sidebar from "@/components/dashboard/sidebar";
import { useMatchedStudents } from "@/context/MatchedStudentsContext";
import docDataToStudent from "@/components/docToStudent";
import { getDoc, doc } from "firebase/firestore";
import { auth, provider, db } from "../lib/firebase";
import matchStudents from "@/components/matchStudents";


export default function Dashboard() {
  const [user, setUser] = useState<User | null>();
  const {matchedStudents, setMatchedStudents} = useMatchedStudents();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "students", user.uid);
          const snapshot = await getDoc(userRef);
          if (!snapshot.exists()) return;
          const student = docDataToStudent(snapshot);
          const matches = await matchStudents(student);
          setMatchedStudents(matches);
        }
      });
  
      return () => unsubscribe();
    }, []);

 

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.displayName?.split(" ")[0]}
            </h1>
            <p className="text-gray-600">
              Ready to connect with fellow students at your university?
            </p>
          </div>

          {/* Stats */}
          <DashboardStats
            matches={matchedStudents.length}
            chats={0}
            groups={0}
            sessions={15}
          />

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left / Main column - wider */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileSummary
                name={user?.displayName || ""}
                major="Computer Science"
                year="junior"
                about="CS junior passionate about AI and machine learning. Looking for study partners for algorithms and data structures courses."
                preferences={[
                  "Coffee Shops",
                  "Library",
                  "Group Study",
                  "Online Video Calls",
                ]}
              />
            </div>

            {/* Right column - taller cards */}
            <div className="flex flex-col gap-6">
              <div className="h-[30vh]">
                <RecentActivity  />
              </div>
              <div className="h-[30vh]">
                <QuickActions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
