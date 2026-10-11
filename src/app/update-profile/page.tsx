"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiUser } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }

    if (session?.user?.name) {
      setName((currentName) => currentName || session.user.name);
    }
  }, [isPending, session, router]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("নাম সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F1F6F1]">
        <span className="loading loading-spinner loading-lg text-[#05893E]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F6F1] px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-3xl">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1D271F]">
            আমার প্রোফাইল
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden bg-gray-100 text-gray-600 font-bold border border-gray-200">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <FiUser className="text-2xl" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1D271F]">
                {session.user.name || "ব্যবহারকারী"}
              </h2>
              <p className="text-sm text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await authClient.signOut();
              router.push("/signin");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <span>↪</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8">
          <h3 className="text-lg font-bold text-[#1D271F] mb-6">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#1D271F]"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#1D271F] outline-none transition focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#05893E] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#047533] disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}