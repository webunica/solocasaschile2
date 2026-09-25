import { createClient } from "./client";

export async function signOutClientAndServer(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
  } catch (err) {
    console.error("Client auth signOut error:", err);
  }

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server auth logout error:", err);
  }

  if (typeof window !== "undefined") {
    try {
      // Clear all supabase keys in localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Clear all supabase keys in sessionStorage
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));

      // Clear client document.cookie for supabase
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith("sb-") || name.includes("supabase")) {
          document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          document.cookie = `${name}=; Path=/; Domain=.solocasaschile.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
      }
    } catch (e) {
      console.error("Error clearing client storage:", e);
    }

    // Force full page reload to reset all client and server states
    window.location.replace("/");
  }
}
