import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

export default function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.6)] p-4 backdrop-blur-xl transition-colors hover:border-[#FF9B03]/30",
        className
      )}
    >
      {children}
    </div>
  );
}