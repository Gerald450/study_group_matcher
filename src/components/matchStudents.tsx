"use client"
import { useState, useEffect } from "react";
import { auth, provider, db } from "../lib/firebase";

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

export type Match = {
    id: string;
    name: string;
    university: string;
    courses: string[];
    times: string[];
    image?: string;
  };

 export type Student = {
    id: string;
    name: string;
    university: string;
    courses: string;
    availability: string;
    studyStyle: string;
    image?: string;
  };

export default async function matchStudents(newStudent: Student): Promise<Match[]> {


    const studentsRef = collection(db, "students");
    const snapshot = await getDocs(studentsRef);

    const matches: Match[] = [];

    const newCourses = newStudent.courses
      .split(",")
      .map((a) => a.trim().toLowerCase());

    const newAvailability = newStudent.availability
      .split(",")
      .map((b) => b.trim().toLowerCase());

    snapshot.forEach((doc) => {
      const data = doc.data();

      // skip if same person
      if (data.id === newStudent.id) return;

      const otherCourses = (data.courses || "")
        .split(",")
        .map((c: string) => c.trim().toLowerCase());

      const otherAvailability = (data.availability || "")
        .split(",")
        .map((c: string) => c.trim().toLowerCase());

      const commonCourses = newCourses.filter((course) =>
        otherCourses.includes(course)
      );

      if (commonCourses.length === 0) return;

      const commonTimes = newAvailability.filter((slot) =>
        otherAvailability.includes(slot)
      );

      if (commonTimes.length === 0) return;

      matches.push({
        id: data.id,
        name: data.name,
        university: data.university,
        courses: commonCourses,
        times: commonTimes,
        image: data.image,
      });
    });
    return matches;

  }
