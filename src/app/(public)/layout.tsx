import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getMegaMenuAds } from "@/lib/supabase/services"

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const megaMenuAds = await getMegaMenuAds();

  return (
    <div className="min-h-screen flex flex-col">
      <Header megaMenuAds={megaMenuAds} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
