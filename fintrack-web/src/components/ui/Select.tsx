import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface Opcao {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (valor: string) => void;
  options: Opcao[];
  placeholder?: string;
}

export function Select({ label, value, onChange, options, placeholder = "Selecione" }: SelectProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  const selecionado = options.find((o) => o.value === value);

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="mb-1.5 block text-xs font-medium text-slate-300">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border bg-slate-900/60 px-3.5 py-3 text-left text-sm transition duration-200",
            aberto ? "border-[#FF9B03] ring-1 ring-[#FF9B03]" : "border-slate-700/80"
          )}
        >
          <span className={selecionado ? "text-white" : "text-slate-500"}>
            {selecionado ? selecionado.label : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", aberto && "rotate-180")} />
        </button>

        <AnimatePresence>
          {aberto && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[rgba(15,23,42,0.97)] p-1 shadow-2xl backdrop-blur-xl"
            >
              {options.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">Nenhuma opção disponível</p>}
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setAberto(false); }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    o.value === value ? "bg-[#FF9B03]/15 text-[#FF9B03]" : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}