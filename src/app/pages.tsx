'use client'

import { useEffect, useState } from "react";
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/ui/navbar";
import StudyGroupMatcher from "@/components/ui/StudyGroupMatcher";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/signin');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <StudyGroupMatcher />
    </>
  );
}
