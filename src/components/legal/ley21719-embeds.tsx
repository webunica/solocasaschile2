"use client";

import { useEffect } from "react";

export function LeyRightsForm() {
  useEffect(() => {
    const container = document.getElementById("ley21719-rights-form");
    if (container && container.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://proteccion-datos-admin.vercel.app//widget.js";
      script.setAttribute("data-tenant", "solocasaschile");
      script.async = true;
      document.body.appendChild(script);
      return () => {
        script.remove();
      };
    }
  }, []);

  return <div id="ley21719-rights-form" className="w-full flex justify-center py-4" />;
}

export function LeyPolicyEmbed() {
  useEffect(() => {
    const container = document.getElementById("ley21719-policy");
    if (container && container.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://proteccion-datos-admin.vercel.app//widget.js";
      script.setAttribute("data-tenant", "solocasaschile");
      script.async = true;
      document.body.appendChild(script);
      return () => {
        script.remove();
      };
    }
  }, []);

  return (
    <div
      id="ley21719-policy"
      className="w-full bg-card/40 border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
    />
  );
}
