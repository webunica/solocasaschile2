import { redirect } from "next/navigation";

export const metadata = {
  title: "Verificación de Empresas Constructoras | SoloCasasChile",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificacionEmpresasConstructorasPage() {
  redirect("/en-construccion");
}
