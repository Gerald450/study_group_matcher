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
import { useMatchedStudents } from "@/context/MatchedStudentsContext";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { matchedStudents, setMatchedStudents } = useMatchedStudents();
  const [user, setUser] = useState<User | null>()
  const router = useRouter();


    // on refresh, load matches for current user
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
    })
    return () => unsubscribe();
  })

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Profile Header */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
        <img
          src={user?.photoURL || "/avatar-default"}
          alt="Profile Avatar"
          width={120}
          height={120}
          className="rounded-full shadow-md"
        />
        <h1 className="text-2xl font-bold mt-4">{auth.currentUser?.displayName}</h1>
        <p className="text-gray-500">{auth.currentUser?.email}</p>

        <div className="mt-6 flex gap-3">
          <Button onClick={() => router.push("/edit-profile")} className="bg-blue-600 hover:bg-blue-700">
            Edit Profile
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <Card className="bg-purple-50 border-none">
          <CardContent className="text-center py-6">
            <p className="text-gray-500">Active Matches</p>
            <p className="text-3xl font-bold text-purple-600">{matchedStudents.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-none">
          <CardContent className="text-center py-6">
            <p className="text-gray-500">Active Chats</p>
            <p className="text-3xl font-bold text-blue-600">5</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-none">
          <CardContent className="text-center py-6">
            <p className="text-gray-500">Completed Sessions</p>
            <p className="text-3xl font-bold text-green-600">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-600">
          Passionate student eager to collaborate and learn with peers. I love group discussions,
          problem-solving, and helping others understand challenging topics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-gray-500">University</h3>
            <p className="font-medium">Example University</p>
          </div>
          <div>
            <h3 className="text-gray-500">Courses</h3>
            <p className="font-medium">Computer Science, AI, Web Development</p>
          </div>
          <div>
            <h3 className="text-gray-500">Study Style</h3>
            <p className="font-medium">Collaborative, Hands-on</p>
          </div>
          <div>
            <h3 className="text-gray-500">Availability</h3>
            <p className="font-medium">Weekdays, Evenings</p>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {matchedStudents.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {matchedStudents.slice(0, 5).map((match) => (
                <li key={match.id} className="flex items-center gap-4 py-4">
                  <img
                    src={match.image || "/default-avatar.png"}
                    alt={match.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{match.name}</p>
                    <p className="text-sm text-gray-500">{match.courses.join(", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No matches yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
