import { NextResponse } from "next/server";
// Make sure this path matches where you put your server.ts helper!
import { createClient } from "@/src/lib/supabase/server";

export async function GET(request: Request) {
  // 1. Parse the URL to find the secret code Google sent back
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 'next' is an optional URL parameter if you want to redirect them to a specific
  // page after login. If it's empty, we just send them to the home page ("/").
  const next = searchParams.get("next") ?? "/";

  if (code) {
    // 2. Initialize the secure server client
    const supabase = await createClient();

    // 3. Trade the code for a secure session cookie!
    // Because we set up the server.ts file correctly, this function automatically
    // puts the token directly into the browser's secure cookie jar.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success! The cookies are set. Send them into the app.
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Auth Callback Error:", error.message);
    }
  }

  // If there was no code, or if the exchange failed, send them back to the home page
  // (You could also redirect to a specific error page like /error if you build one)
  return NextResponse.redirect(`${origin}/`);
}
