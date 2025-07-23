'use client'
import {useEffect, useState} from 'react';
import {db, auth} from '@/lib/firebase'
import{
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    or
} from 'firebase/firestore'

import {Input} from './input'
import { Button} from './button';
import { timeStamp } from 'console';


export default function ChatRoom ({otherUser}) {
    const currentUser = auth.currentUser;
    const chatId = [currentUser?.uid, otherUser.uid].sort().join('_');
    const [messages, setMessages] = useState([]);

    const[newMessage, setNewMessage] = useState('')

    useEffect(() => {
        const q = query(
            collection(db, 'chat', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        )
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs)
        });
        return () => unsubscribe()
    }, [chatId])

    const sendMessage = async (e) => {
        e.preventDefault();

        

        if (!newMessage.trim()) return;


        await addDoc(collection(db, 'chat', chatId, 'messages'), {
            senderId: currentUser?.uid,
            receiverId:otherUser.uid,
            text: newMessage.trim(),
            timestamp: serverTimestamp(),
        });
        setNewMessage("")
    };

    return (
        <div className='flex flex-col h-[400px] border rounded-lg p-4 bg-white shadow-md'>
            {/* are to display message */}
            <div className='flex-1 overflow-y-auto mb-2'>
                {messages.map((msg) => (
                    <div
                    key ={msg.id}
                    className={`mb-2 p-2 rounded-md w-fit text-sm text-black ${
                        msg.senderId === currentUser.uid
                        ? "bg-blue-100 ml-auto"
                        : "bg-gray-200"
                    }`}
                    >
                        {msg.text || <span className="text-red-500 italic">[No message]</span>}
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className='flex gap-2'>
                <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type a message...'
                />
                <Button type='submit' >Send</Button>
            </form>

        </div>
    )
}