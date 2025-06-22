'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function StudyGroupMatcher() {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    courses: "",
    availability: "",
    studyStyle: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Add submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Study Group Matcher</h1>
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
        </CardContent>
      </Card>
    </div>
  );
}
