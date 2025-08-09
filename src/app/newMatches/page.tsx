"use client"
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


export default function NewMatchesPage() {
  const { matchedStudents, setMatchedStudents } = useMatchedStudents();
  const [openChatId, setOpenChatId] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Your New Matches
      </h1>

      {matchedStudents.length === 0 ? (
        <p className="text-gray-600 text-lg">No matches found yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {matchedStudents.map((match) => (
            <Card
              key={match.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <img
                  src={match.image || "/default-avatar.png"}
                  alt={match.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <h2 className="text-xl font-medium text-gray-800">
                  {match.name}
                </h2>
                <p className="text-gray-600 text-center px-2">
                  {match.university || "University not specified"}
                </p>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() =>
                    setOpenChatId((prev) =>
                      prev === match.id ? null : match.id
                    )
                  }
                >
                  Message
                </Button>
                {openChatId === match.id && (
                  <div className="mt-4">
                    <p className="font-semibold">{match.name}</p>
                    <ChatRoom
                      otherUser={{
                        uid: match.id,
                        name: match.name,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
