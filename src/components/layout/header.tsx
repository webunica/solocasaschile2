import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center overflow-x-auto px-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Volver al inicio de SolocasasChile">
          <span className="font-heading font-extrabold text-2xl tracking-tighter gradient-text">SolocasasChile</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium" aria-label="Navegación principal">
            <Link href="/catalogo" className="transition-colors hover:text-primary text-foreground/60 focus-visible:text-primary">
              Catálogo
            </Link>
            <Link href="/comparar" className="transition-colors hover:text-primary text-foreground/60 focus-visible:text-primary">
              Comparador
            </Link>
            <Link href="/constructoras" className="transition-colors hover:text-primary text-foreground/60 hidden sm:inline-block focus-visible:text-primary">
              Constructoras
            </Link>
          </nav>
          <div className="flex items-center space-x-2 ml-4 border-l pl-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
            >
              Acceder
            </Link>
            <Link 
              href="/cotizar" 
              className={buttonVariants({ size: "sm" })}
            >
              Cotizar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
