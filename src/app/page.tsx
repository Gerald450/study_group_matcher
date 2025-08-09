"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import DashboardStats from "@/components/dashboard/dashboardStats";
import ProfileSummary from "@/components/dashboard/profileSummary";
import RecentActivity from "@/components/dashboard/recentActivity";
import QuickActions from "@/components/dashboard/quickActions";
import Sidebar from "@/components/dashboard/sidebar";
import matchStudents from "@/components/matchStudents";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
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
            matches={matchStudents.length}
            chats={0}
            groups={0}
            sessions={15}
          />

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left / Main column */}
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

            {/* Right column */}
            <div className="space-y-6">
              <RecentActivity />
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
