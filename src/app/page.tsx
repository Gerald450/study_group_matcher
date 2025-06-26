"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "../lib/firebase";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "react-clock/dist/Clock.css";
import TimePicker from "react-time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

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
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [availabilitySummary, setAvailabilitySummary] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
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

    if (!selectedDay || !startTime || !endTime) {
      alert("Please select a date and time range");
      return;
    }

    const formattedAvailability = `${selectedDay.toDateString()} ${startTime}-${endTime}`;

    try {
      await addDoc(collection(db, "students"), {
        ...formData,
        availability: availabilitySummary,
      });

      alert("form submitted successfully!");

      //reset form
      setFormData({
        name: "",
        university: "",
        courses: "",
        availability: "",
        studyStyle: "",
      });

      //reset calendar inputs
      setSelectedDay(undefined);
      setStartTime("10:00");
      setEndTime("12:00");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
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
            {/* popover */}

            <Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="w-full border rounded-md px-3 py-2 text-left text-sm text-muted-foreground shadow-sm"
    >
      {availabilitySummary || "Select availability"}
    </button>
  </PopoverTrigger>

  <PopoverContent
    className="w-[320px] max-w-[90vw] p-4 bg-white border rounded-md shadow-xl z-50"
    align="start"
    side="bottom"
    sideOffset={8}
  >
    <div className="bg-white px-2 py-2 rounded-md flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-1">Pick a day</p>
        <DayPicker
          animate
          selected={selectedDay}
          onSelect={setSelectedDay}
          mode="single"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Pick time range</p>
        <div className="flex gap-4 items-center">
          <TimePicker value={startTime} onChange={setStartTime} />
          <span>to</span>
          <TimePicker value={endTime} onChange={setEndTime} />
        </div>
      </div>

      <button
        type="button"
        className="mt-2 text-sm underline text-blue-600"
        onClick={() => {
          if (selectedDay && startTime && endTime) {
            const summary = `${selectedDay.toDateString()} ${startTime}-${endTime}`;
            setAvailabilitySummary(summary);
          }
        }}
      >
        Confirm Selection
      </button>
    </div>
  </PopoverContent>
</Popover>

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
              className="text-xl font-smibold text-center cursor-pointer hover:underline"
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
                      <p className="font-medium">
                        {student.name} - {student.university}
                      </p>
                      <p>
                        <span className="font-semibold">Courses:</span>{" "}
                        {student.courses}
                      </p>
                      <p>
                        <span className="font-semibold">Availability:</span>{" "}
                        {student.availability}
                      </p>

                      <p>
                        <span className="font-semibold">Study Style:</span>{" "}
                        {student.studyStyle}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
