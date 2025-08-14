"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          toast.success("Logged out successfully!");
        } else {
          toast.error("Logout failed");
        }
      } catch {
        toast.error("An error occurred during logout");
      } finally {
        // Redirect to home page regardless of success/failure
        router.push('/');
      }
    };

    performLogout();
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </main>
  );
}