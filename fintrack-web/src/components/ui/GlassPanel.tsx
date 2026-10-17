import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Painel com efeito "vidro fosco", no mesmo padrão visual das telas de
 * login e cadastro. Reaproveitado em telas internas que pedem um destaque
 * tecnológico, como o Simulador e o Assistente.
 */
export default function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.75)] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_30px_rgba(255,155,3,0.1)] backdrop-blur-xl sm:p-8",
        className
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF9B03]/50 to-transparent" />
      {children}
    </div>
  );
}