import { ConstruHeader } from "@/components/constru/constru-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Constru | Catálogo de Materiales y Proveedores",
  description: "Plataforma técnica para constructoras. Encuentra proveedores de sistemas SIP, terminaciones y suministros industriales.",
};

export default function ConstruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-500" 
      style={{ 
        // Overriding CSS Brand Variables for Constru Identity (#fa8823)
        // HSL of #fa8823 is 28 96% 56%
        '--primary': '28 96% 56%',
        '--brand-indigo': '28 96% 35%',
        '--brand-teal': '28 96% 56%',
        '--ring': '28 96% 56%',
        '--radius-lg': '1.5rem',
      } as any}
    >
      <ConstruHeader />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 bg-grid-pattern overflow-x-hidden">
        {children}
      </main>
      
      {/* Brand Watermark for Constru */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-5 hidden lg:block">
        <span className="text-8xl font-black italic tracking-tighter uppercase whitespace-nowrap">
          CONSTRU<span className="text-[#fa8823]">.</span>
        </span>
      </div>
    </div>
  );
}
