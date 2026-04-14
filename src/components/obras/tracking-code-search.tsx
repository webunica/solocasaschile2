"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_CODE = "e356c78f-9374-4a71-ab07-52254530c6b3";

export function TrackingCodeSearch() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trackingCode = code.trim();
    if (!trackingCode) return;

    router.push(`/seguimiento/${encodeURIComponent(trackingCode)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded-[1.5rem] border border-brand-indigo/10 bg-white/80 p-3 shadow-xl shadow-brand-indigo/5 backdrop-blur-xl"
    >
      <label
        htmlFor="tracking-code"
        className="mb-2 block px-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-indigo/60"
      >
        Consulta el estado de tu obra
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="tracking-code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={EXAMPLE_CODE}
          autoComplete="off"
          className="min-h-12 flex-1 rounded-xl border border-border/60 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15"
        />
        <Button
          type="submit"
          className="h-12 rounded-xl bg-brand-teal px-6 text-xs font-black uppercase tracking-widest text-brand-indigo hover:bg-brand-teal/90"
        >
          Buscar
          <Search className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <p className="mt-3 px-2 text-xs font-medium leading-relaxed text-muted-foreground">
        Ejemplo: Proyecto Casa Castor - Familia Velasquez.
      </p>
    </form>
  );
}
