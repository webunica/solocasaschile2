import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>SolocasasChile {year}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="hover:text-foreground">
              Terminos
            </Link>
            <Link href="/catalogo" className="hover:text-foreground">
              Catalogo
            </Link>
            <Link href="/constructoras" className="hover:text-foreground">
              Constructoras
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
