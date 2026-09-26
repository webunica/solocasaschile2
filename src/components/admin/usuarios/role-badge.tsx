"use client";

import { type AppRole, ROLE_LABELS, ROLE_BADGE_CLASSES } from "@/lib/security/roles";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, ShoppingBag, User } from "lucide-react";

interface RoleBadgeProps {
  role: AppRole | null;
  size?: "sm" | "md";
}

const ROLE_ICONS = {
  superadmin: ShieldAlert,
  admin: ShieldCheck,
  vendedor: ShoppingBag,
};

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  if (!role) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/50 text-muted-foreground font-semibold",
          size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
        )}
      >
        <User className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
        Constructora
      </span>
    );
  }

  const Icon = ROLE_ICONS[role];
  const classes = ROLE_BADGE_CLASSES[role];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-bold",
        classes,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      )}
    >
      <Icon className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
      {ROLE_LABELS[role]}
    </span>
  );
}
