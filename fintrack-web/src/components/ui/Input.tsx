import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[rgb(var(--text-secondary))]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))]">
              {icon}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full rounded-xl border bg-base-2 px-4 py-2.5 text-sm outline-none transition-colors",
              "border-[rgb(var(--border))] placeholder:text-[rgb(var(--text-secondary))]/60",
              "focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20",
              icon && "pl-10",
              error && "border-danger-500/60 focus:border-danger-500 focus:ring-danger-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-danger-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
