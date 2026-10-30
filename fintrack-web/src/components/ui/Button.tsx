import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium " +
      "transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50";

    const variants = {
      primary:
        "bg-brand-500 text-base-0 hover:bg-brand-400 shadow-glow",
      secondary:
        "bg-base-3 text-[rgb(var(--text-primary))] hover:bg-base-4 border border-[rgb(var(--border))]",
      ghost:
        "bg-transparent text-[rgb(var(--text-secondary))] hover:bg-base-3 hover:text-[rgb(var(--text-primary))]",
      danger:
        "bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
