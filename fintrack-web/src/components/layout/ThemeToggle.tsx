import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { alternarTema, obterTema, type Tema } from "../../lib/theme";

export default function ThemeToggle() {
  const [tema, setTema] = useState<Tema>(obterTema());

  function handleClick() {
    const novoTema = alternarTema();
    setTema(novoTema);
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Alternar tema claro/escuro"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-base-2 text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {tema === "dark" ? (
          <motion.span
            key="sol"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="lua"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}