import React, {useState, useEffect} from 'react'
import { signOut } from 'firebase/auth';
import {auth} from '@/lib/firebase';
import { Button } from './button';
import Link from 'next/link';



export default function Navbar(){
    const [username, setUsername] = useState('')
    const [photo, setPhoto] = useState(null)

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
            alert('You are signed out!')
        }catch(err){
            console.error('Sign out error: ', err)
        }
    }

    return (
        <nav className='bg-white border-b shadow-sm p-4 sticky top-0 z-50'>
            <div className='max-w-6xl mx-auto flex justify-between items-center'>
                <img src={photo} alt="google photo" />
                <h1>Hey {username}</h1>
                <Link href='/' className='text-xl font-semiboldtext-indigo-600'>
                    StudyGroupMatcher
                </Link>
                <Button variant='outline' onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </nav>
    );
}

