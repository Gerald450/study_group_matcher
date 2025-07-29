'use client'
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from './button';
import Link from 'next/link';

export default function Navbar() {
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName || '');
      setPhoto(currentUser.photoURL || '');
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You are signed out!');
    } catch (err) {
      console.error('Sign out error: ', err);
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        
        <div className="flex items-center gap-3">
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="w-15 h-15 rounded-full object-cover border"
            />
          )}
          {username && (
            <span className="text-sm font-medium text-gray-700">Hey {username}</span>
          )}
        </div>

       
        <Link href="/" className="text-lg font-bold text-indigo-600 hover:underline">
          StudyGroupMatcher
        </Link>

        
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
