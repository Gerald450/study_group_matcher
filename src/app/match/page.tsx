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

export default function StudyGroupMatcher() {
  const [formData, setFormData] = useState({
    university: "",
    courses: "",
    availability: "",
    studyStyle: "",
  });

 

  const [students, setStudents] = useState<Student[]>([]);
  const [showStudents, setShowStudents] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState<Match[]>([]);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  // authentication
  const [user, setUser] = useState<User | null>(null);

  // convert Firestore doc snapshot to Student

  

  // real-time view of all students
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          university: data.university || "",
          courses: data.courses || "",
          availability: data.availability || "",
          studyStyle: data.studyStyle || "",
          image: data.image,
        } as Student;
      });
      setStudents(studentList);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please sign in first");
      return;
    }

    const docRef = doc(db, "students", currentUser.uid);
    const currentData = await getDoc(docRef);

    const studentData = {
      ...(currentData.exists() ? currentData.data() : {}),
      ...formData,
      id: currentUser.uid,
      name: currentUser.displayName || "",
      image: currentUser.photoURL || "",
    };

    try {
      await setDoc(docRef, studentData);
      alert("Form submitted successfully!");

      // Convert to Student type safely before matching
      // const student: Student = {
      //   id: studentData.id,
      //   name: studentData.name,
      //   university: studentData.university || "",
      //   courses: studentData.courses || "",
      //   availability: studentData.availability || "",
      //   studyStyle: studentData.studyStyle || "",
      //   image: studentData.image,
      // };

      const matched = await matchStudents(studentData);
      setMatchedStudents(matched);

      setFormData({
        university: "",
        courses: "",
        availability: "",
        studyStyle: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };



  // listen for auth changes and update user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">
              Study Group Matcher
            </h1>
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="university"
                    placeholder="University"
                    value={formData.university}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="courses"
                    placeholder="Courses (e.g., Calculus I, CS2301)"
                    value={formData.courses}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="availability"
                    placeholder="Availability (e.g., Mon 2-4pm, Wed 10am-12pm, Fri 1-3pm)"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="studyStyle"
                    placeholder="Study Style (e.g., quiet, discussion-heavy)"
                    value={formData.studyStyle}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Find My Group
                  </Button>
                </form>

                <div className="mt-10 space-y-4">
                  <h2
                    className="text-xl font-semibold text-center cursor-pointer hover:underline"
                    onClick={() => setShowStudents((prev) => !prev)}
                  >
                    Current Students {showStudents ? "▲" : "▼"}
                  </h2>
                  {showStudents &&
                    (students.length === 0 ? (
                      <p className="text-center text-gray-500">
                        No students submitted yet
                      </p>
                    ) : (
                      students.map((student) => (
                        <Card key={student.id} className="bg-white">
                          <CardContent className="p-4 space-y-1">
                            <div className="flex items-center gap-4">
                              <img
                                className="rounded-md"
                                src={student.image}
                                alt="google photo"
                                width={80}
                                height={80}
                              />
                              <div>
                                <p className="font-medium">
                                  {student.name} - {student.university}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Courses:
                                  </span>{" "}
                                  {student.courses}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Availability:
                                  </span>{" "}
                                  {student.availability}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Study Style:
                                  </span>{" "}
                                  {student.studyStyle}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ))}
                </div>

                {matchedStudents.length > 0 ? (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Your Matches</h2>
                    <div className="space-y-4">
                      {matchedStudents.map((match) => (
                        <div key={match.id}>
                          <div className="flex-col border rounded-md shadow-sm p-4">
                            <div className="p-4 bg-white space-y-2 flex justify-between gap-5 relative">
                              <img
                                className="rounded-md"
                                src={match.image}
                                alt="google photo"
                                width={80}
                                height={80}
                              />

                              <div className="flex-1">
                                <p className="text-md font-medium">
                                  {match.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {match.university}
                                </p>
                                <p className="text-sm">
                                  <strong>Shared Courses: </strong>{" "}
                                  {match.courses.join(", ")}
                                </p>
                                <p className="text-sm">
                                  <strong>Shared Times: </strong>{" "}
                                  {match.times.join(", ")}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <Button
                                onClick={() =>
                                  setOpenChatId((prev) =>
                                    prev === match.id ? null : match.id
                                  )
                                }
                              >
                                Text {match.name}
                              </Button>
                            </div>

                           
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>You have no matches</div>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
