import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(224,244,255,0.85),transparent_34%),radial-gradient(circle_at_top_right,rgba(234,253,232,0.7),transparent_28%)]" />
      <Header />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  )
}
