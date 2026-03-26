import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso Constructor | SolocasasChile",
  description: "Ingresa a tu panel de administración corporativo para gestionar tus modelos de casas y prospectos.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen font-sans antialiased bg-background">
      {children}
    </main>
  );
}
