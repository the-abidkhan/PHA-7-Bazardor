"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
        setLoading(false);
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setSocialLoading(true);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error("সোশ্যাল লগইনে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setSocialLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F1F6F1] px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1D271F]">সাইন ইন</h1>
          <p className="mt-1 text-sm text-gray-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্ট ঢুকুন।
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#05893E]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#05893E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || socialLoading}
            className="w-full rounded-lg bg-[#05893E] px-4 py-3 font-semibold text-white transition hover:bg-[#047533] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "লগইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading || socialLoading}
            onClick={() => handleSocialSignIn("google")}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <FcGoogle className="text-base" />
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            disabled={loading || socialLoading}
            onClick={() => handleSocialSignIn("github")}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <FaGithub className="text-base" />
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#05893E] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-[#05893E]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}