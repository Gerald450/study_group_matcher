import { Button } from "../ui/button";
import { auth, provider, db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { unsubscribe } from "diagnostics_channel";

type ProfileSummaryProps = {
  name: string;
  major: string;
  year: string;
  about: string;
  preferences: string[];
};

export default function ProfileSummary({
  name,
  major,
  year,
  about,
  preferences,
}: ProfileSummaryProps) {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const unsubscribe = () => {
      setUser(auth.currentUser);
    };
    return () => unsubscribe();
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 w-full lg:w-[95%]">
      <h2 className="font-semibold text-xl text-gray-800 border-b pb-2">
        Your Profile Summary
      </h2>
      <img
        src={user?.photoURL || "public/avatar-default.svg"}
        alt="Profile Avatar"
        className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-200"
      />
      <p className="font-bold text-center text-gray-900 text-lg">{name}</p>
      <p className="text-sm text-gray-600 text-center">
        {major} • {year}
      </p>
      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{about}</p>
      <div className="flex gap-2 flex-wrap">
        {preferences.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Edit Profile
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          Find Study Partners
        </Button>
      </div>
    </div>
  );
}
