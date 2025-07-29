'use client'

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { Input } from './input';
import { Button } from './button';
import { onAuthStateChanged, User } from 'firebase/auth';

type ChatRoomProps = {
  otherUser: {
    uid: string;
    name: string;
  };
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
};

export default function ChatRoom({ otherUser }: ChatRoomProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const chatId =
    currentUser && otherUser
      ? [currentUser.uid, otherUser.uid].sort().join('_')
      : null;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chat', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !chatId) return;

    await addDoc(collection(db, 'chat', chatId, 'messages'), {
      senderId: currentUser.uid,
      receiverId: otherUser.uid,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  if (!currentUser) {
    return <p className="text-red-500">You must be signed in to use the chat.</p>;
  }

  return (
    <div className="flex flex-col h-[400px] border rounded-lg p-4 bg-white shadow-md">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-md w-fit text-sm text-black ${
              msg.senderId === currentUser.uid ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
            }`}
          >
            {msg.text || <span className="text-red-500 italic">[No message]</span>}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
