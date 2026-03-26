"use client";

import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareActionsProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareActions({ title, url, className }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - Mira este modelo en SolocasasChile: ${fullUrl}`)}`, '_blank');
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-2xl border border-border/40 backdrop-blur-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={shareWhatsApp}
                className="w-9 h-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all active:scale-90"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg">
              WhatsApp
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className={cn(
                  "w-9 h-9 rounded-xl transition-all active:scale-90",
                  copied ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                )}
              >
                {copied ? <Share2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg">
              {copied ? "¡Copiado!" : "Copiar Enlace"}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
