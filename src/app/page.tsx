"use client";
import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth, provider, db } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { University } from "lucide-react";
import { error } from "console";


export default function StudyGroupMatcher() {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    courses: "",
    availability: "",
    studyStyle: "",
  });

  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState([]);

  //authentication
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;

      setUser(userData);

      const userRef = doc(db, 'students', userData.uid);
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: userData.displayName || "",
          university: "",
          courses: "",
          availability: "",
          studyStyle: "",
          email: userData.email,
        })
      }
    }catch(err){
      console.error('Error signing in: ', err)
    }
  }
  


 useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
    const studentList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentList);
  });
  return () => unsubscribe();
 }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentUser = auth.currentUser;

    if (!currentUser){
      alert('Please sign in first');
      return;
    }

    const studentData = {
      ...formData,
      name: currentUser.displayName || formData.name,
      email: currentUser.email,
    }



    try {
      await setDoc(doc(db, "students", currentUser.uid), studentData)
      alert("form submitted successfully!");
      const matched = await matchStudents(formData);
      setMatchedStudents(matched);


      setFormData({
        name: "",
        university: "",
        courses: "",
        availability: "",
        studyStyle: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
    const newStudent = {
      ...formData,
    };


   
    
  };

  const matchStudents = async(newStudent) => {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);

    const matches = [];

    const newCourses = newStudent.courses.split(",").map((a)=>a.trim().toLowerCase());

    const newAvailability = newStudent.availability.split(",").map((b) => b.trim().toLowerCase());
    

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (
        data.name === newStudent.name && data.university === newStudent.university

      )return

      const otherCourses = (data.courses || "").split(',').map((c) => c.trim().toLowerCase())

      const otherAvailability = (data.availability || "").split(",").map((c) => c.trim().toLowerCase())
      

      const commonCourses = newCourses.filter((course) => 
        otherCourses.includes(course)
      );

      if (commonCourses.length === 0) return;

      const commonTimes = newAvailability.filter((slot) => 
        otherAvailability.includes(slot)
      );

      if (commonTimes.length === 0) return

      matches.push({
        name:data.name,
        university: data.university,
        courses: commonCourses,
        times:commonTimes
      })
    })
  return matches;
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Study Group Matcher
          </h1>

          {!user ? (
            <div className="text-center">
              <p className="mb-4">Please sign in to see your matches</p>
              <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
            </div>
          ): (
            <div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
            <h2 className="text-xl font-smibold text-center cursor-pointer hover:underline"
              onClick={()=> setShowStudents((prev) => !prev)}
            
            >Current Students {showStudents ? "▲" : "▼"}</h2>
            {showStudents && (
            students.length === 0 ? (
              <p className="text-center text-gray-500">No students submitted yet</p>
            ) : (
              students.map((student) => (
                <Card key={student.id} className="bg-white">
                  <CardContent className="p-4 space-y-1">
                    <p className="font-medium">
                      {student.name} - {student.university}
                    </p>
                    <p>
                      <span className="font-semibold">Courses:</span> {student.courses}
                    </p>
                    <p>
                      <span className="font-semibold">Availability:</span>{" "}{student.availability}
                      </p>

                      <p>
                      <span className="font-semibold">Study Style:</span>{" "}{student.studyStyle}
                      </p>
                    </CardContent>
                    </Card>
              ))
            ))}
          </div>
          {matchedStudents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Your Matches</h2>
              <div className="space-y-4">
                {matchedStudents.map((match, idx) => (
                  <div 
                    key={idx}
                    className="border rounded-md p-4 bg-white shadow-sm space-y-2"
                    >
                      <p className="text-md font-medium">{match.name}</p>
                      <p className="text-sm text-muted-foreground">{match.university}</p>
                      <p className="text-sm">
                        <strong>Shared Courses: </strong> {match.courses.join(",")}
                      </p>
                      <p className="text-sm">
                        <strong>Shared Times: </strong>{match.times.join(",")}
                      </p>
                    </div>
                ))}
              </div>
            </div>
          )}
          </div>)}
        </CardContent>
      </Card>
    </div>
  );
}
