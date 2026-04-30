import { createClient } from "../lib/supabase/server";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // trigger 401 response
  if (error || !user) {
    return null;
  }

  // return both for unrepetetive createClient() calls
  return { user, supabase };
}
