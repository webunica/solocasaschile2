import { getDashboardStats } from "@/lib/supabase/services";
import { LeadsCRM } from "@/components/dashboard/leads-crm";

export const dynamic = "force-dynamic";

export default async function LeadsManagementPage() {
  const { recentLeads } = await getDashboardStats();
  return <LeadsCRM initialLeads={recentLeads as any} />;
}
