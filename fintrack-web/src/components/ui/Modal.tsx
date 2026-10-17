import { type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
}

export default function Modal({ aberto, aoFechar, titulo, children }: ModalProps) {
  // Trava a rolagem da página ao fundo enquanto o modal estiver aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [aberto]);

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop / Fundo escuro desfocado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={aoFechar}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Card do Modal Centralizado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.95)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_35px_rgba(255,155,3,0.12)] backdrop-blur-xl"
          >
            {/* Linha decorativa superior no tom oficial #FF9B03 */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF9B03]/60 to-transparent" />

            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white tracking-tight">{titulo}</h2>
              <button
                type="button"
                onClick={aoFechar}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo do Modal (com rolagem interna caso o formulário seja grande) */}
            <div className="overflow-y-auto p-6 space-y-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}