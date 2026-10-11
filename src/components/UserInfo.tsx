"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GoTriangleDown } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";

export default function UserInfo() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে!");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        },
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="rounded-lg px-4 py-2 text-[#1D271F] hover:bg-gray-100"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-[#05893E] px-4 py-2 text-white hover:bg-[#047533]"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100"
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            alt="User Avatar"
            src={user.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-medium text-[#1D271F]">{user.name}</span>
        <GoTriangleDown className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-3 shadow-lg border border-gray-100 z-50">
          <div className="border-b border-gray-100 pb-3 px-2">
            <p className="font-semibold text-[#1D271F]">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              href="/update-profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#1D271F] hover:bg-gray-100"
            >
              <FiUser className="text-base text-gray-600" />
              আমার প্রোফাইল
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LuLogOut className="text-base" />
              সাইন আউট
            </button>
          </div>
        </div>
      )}
    </div>
  );
}