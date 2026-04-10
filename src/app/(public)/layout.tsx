import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getMegaMenuAds, getLatestBlogPosts } from "@/lib/supabase/services"

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [megaMenuAds, latestBlogPosts] = await Promise.all([
    getMegaMenuAds(),
    getLatestBlogPosts(2)
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header megaMenuAds={megaMenuAds} latestBlogPosts={latestBlogPosts} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
