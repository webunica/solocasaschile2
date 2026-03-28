"use client";

import { createClient } from "@/lib/supabase/client";

export async function createLead(leadData: any) {
  const supabase = createClient();
  return await supabase.from('leads').insert([leadData]);
}
