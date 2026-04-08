"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";

export function TrustSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-12 bg-white border-b border-border/40 relative z-10 w-full">
      <div className="container max-w-7xl mx-auto px-5 w-full">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            render={
              <Button
                size="lg"
                className="w-full sm:w-auto bg-brand-teal text-brand-indigo font-black text-sm md:text-base rounded-2xl h-12 md:h-16 px-6 md:px-12 shadow-xl shadow-brand-teal/25 transition-transform active:scale-95 border-b-4 border-brand-indigo/20 mx-auto flex"
              >
                SOLICITAR ASESORÍA EXPERTA
                <ArrowRight className="w-5 h-5 ml-4 text-brand-indigo/60" />
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
            <div className="p-6 md:p-12 bg-background w-full space-y-6 border-t-8 border-brand-indigo">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
                  Asesoría <span className="text-brand-teal">Profesional</span>
                </DialogTitle>
                <p className="text-muted-foreground font-medium text-sm">
                  Cuéntanos sobre tu proyecto y recibe atención técnica personalizada.
                </p>
              </DialogHeader>
              <HeroLeadForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
