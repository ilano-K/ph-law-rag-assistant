"use client";

import { useEffect, useState } from "react";
// 1. Import the browser client generator instead of a hardcoded instance
import { Session } from "@supabase/supabase-js";
import { createClient } from "../helpers/supabase/client";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Generate the secure browser client
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch the active session when the app first loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for login or logout events and update the UI automatically
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, [supabase.auth]); // Add supabase.auth to the dependency array

  // google sign in
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
        // Make sure this points to your deployed URL when you go to production!
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  if (loading) return null;

  return (
    <>
      {/* If no user is logged in, show the blocking modal */}
      {!session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-black">Welcome Back</h2>
            <p className="text-gray-500 text-center mb-4">
              Please sign in to access your chats.
            </p>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg w-full justify-center hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      )}

      {/* If logged in, render the actual application */}
      {session && children}
    </>
  );
}
