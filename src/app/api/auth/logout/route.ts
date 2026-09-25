import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Error signing out with supabase server:", e);
  }

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const isProduction =
      process.env.VERCEL_ENV === "production" ||
      (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");
    const cookieDomain = isProduction ? ".solocasaschile.com" : undefined;

    for (const cookie of allCookies) {
      if (
        cookie.name.includes("sb-") ||
        cookie.name.includes("supabase") ||
        cookie.name.includes("auth")
      ) {
        if (cookieDomain) {
          cookieStore.delete({
            name: cookie.name,
            domain: cookieDomain,
            path: "/",
          });
        }
        cookieStore.delete({
          name: cookie.name,
          path: "/",
        });
      }
    }
  } catch (e) {
    console.error("Error deleting auth cookies:", e);
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
