import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.log("No Supabase env vars found in .env.local");
    return;
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("modelos")
    .select("*");

  if (error) {
    console.error("Error connecting to Supabase:", error.message);
    return;
  }

  console.log(`Found ${data.length} models in the REAL Supabase DB:`);
  data.forEach((m: any) => {
    console.log(`- [${m.id}] ${m.nombre} (By Constructora: ${m.constructora_id})`);
  });
}

verify();
