"use client";
import {
  Home,
  User,
  Search,
  MessageCircle,
  Users,
  Calendar,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // make sure you import auth
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function Sidebar() {
  const router = useRouter();
  // sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "./signin";
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col justify-between">
      {/* Top section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 p-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <img
              src="/logo-icon.svg"
              alt="StudyMatcher Logo"
              className="w-6 h-6"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">StudyMatcher</h1>
            <p className="text-xs text-gray-500">Connect. Study. Succeed.</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 px-2 mb-1">
            NAVIGATION
          </p>
          <SidebarItem
            icon={<Home size={18} />}
            label="Overview & Recent"
            active
          />
          <SidebarItem icon={<User size={18} />} label="Profile" />
          <SidebarItem icon={<Search size={18} />} label="Discover" />
          <SidebarItem icon={<MessageCircle size={18} />} label="Chats" />
          <SidebarItem icon={<Users size={18} />} label="Study Groups" />
          <SidebarItem icon={<Calendar size={18} />} label="Calendar" />
        </nav>

        {/* Quick Stats */}
        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-gray-400 px-2 mb-2">
            QUICK STATS
          </p>
          <button className="ml-auto" onClick={() => router.push("/newMatches")}>
            <QuickStat label="Active Matches" count={3} color="bg-purple-500" />
          </button>

          <QuickStat label="Messages" count={8} color="bg-pink-500" />
          <QuickStat label="Study Groups" count={6} color="bg-green-500" />
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="flex items-center gap-3 p-4 border-t">
        <img
          src="/avatar-default.svg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">Student</span>
          <span className="text-xs text-gray-500">Ready to study!</span>
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

// Reusable components
function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function QuickStat({ label, count, color }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${color}`}
      >
        {count}
      </span>
    </div>
  );
}
