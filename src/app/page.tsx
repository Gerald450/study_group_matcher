"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "../lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";


export default function StudyGroupMatcher() {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    courses: "",
    availability: "",
    studyStyle: "",
  });

  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try{
        const snapshot = await getDocs(collection(db, "students"))
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);
      }catch(err){
        console.error('Error fetching students: ', err)
        alert(err)

      }
    }

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "students"), formData);
      alert("form submitted successfully!");
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
    // submission logic here
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Study Group Matcher
          </h1>
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
              placeholder="Availability (e.g., Mon/Wed 3-5pm)"
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
            <h2 className="text-xl font-smibold text-center">Current Students</h2>
            {students.length === 0 ? (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
