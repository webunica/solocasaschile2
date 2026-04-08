"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
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
  showLabel?: boolean;
}

export function ShareActions({ title, url, className, showLabel = false }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - Mira este artículo en SolocasasChile: ${fullUrl}`)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel && <span className="text-xs font-black uppercase tracking-widest text-[#1b0088] opacity-60">Compartir:</span>}
      <TooltipProvider>
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-border/40 shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={shareWhatsApp}
                className="w-9 h-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all active:scale-90"
              >
                <FaWhatsapp className="w-4 h-4" />
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
                onClick={shareFacebook}
                className="w-9 h-9 rounded-xl hover:bg-blue-600/10 hover:text-blue-600 transition-all active:scale-90"
              >
                <FaFacebookF className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg">
              Facebook
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="w-9 h-9 rounded-xl hover:bg-pink-600/10 hover:text-pink-600 transition-all active:scale-90"
              >
                <FaInstagram className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg">
              Instagram (Copiar Link)
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
