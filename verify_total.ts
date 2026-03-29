import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verifyTotal() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { count, error } = await supabase
    .from("modelos")
    .select("*", { count: 'exact', head: true });
    
  if (error) {
    console.error("Error counts modelos:", error.message);
  } else {
    console.log("TOTAL MODELS IN TABLE:", count);
  }
}

verifyTotal();
